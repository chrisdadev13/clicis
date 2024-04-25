"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar as CalendarIcon } from "lucide-react";
import { api } from "@/trpc/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MagnifyingGlassIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

enum MeetTime {
  Today,
  Tomorrow,
  In3Days,
  InAWeek,
  InAMonth,
  Random,
}
export default function ContactSheet({
  contact,
}: {
  contact: {
    id: string;
    username: string;
    name: string;
    tag: string;
    checkInFrequency: string;
    calId: number | null;
  };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showEventTypes, setShowEventTypes] = React.useState(false);
  const { mutate, isPending } = api.cal.checkAvailabilityAndSave.useMutation({
    onSuccess: () => {
      router.push("/check-ins");
      router.refresh();
    },
    onError: (opts) => {
      toast({
        variant: "destructive",
        title: "This user is not available... for you!! 😢",
        description: opts.message,
        duration: 3000,
      });
    },
  });

  const { data } = api.contacts.getEvents.useQuery({
    contactId: contact.id,
    contactCalId: contact.calId!,
  });

  const checkAvailabilityAndBook = async (
    meetTime: MeetTime,
    eventId: number,
  ) => {
    const startDate = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    );
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    );
    endDate.setHours(23, 59, 59, 999);

    if (meetTime === MeetTime.Today) {
      mutate({
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        eventId,
      });
    } else if (meetTime === MeetTime.Tomorrow) {
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(startDate.getDate() + 2);
      mutate({
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        eventId,
      });
    } else if (meetTime === MeetTime.In3Days) {
      startDate.setDate(startDate.getDate() + 3);
      endDate.setDate(startDate.getDate() + 6);
      mutate({
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        eventId,
      });
    } else if (meetTime === MeetTime.InAWeek) {
      startDate.setDate(startDate.getDate() + 7);
      endDate.setDate(startDate.getDate() + 14);
      mutate({
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        eventId,
      });
    } else if (meetTime === MeetTime.InAMonth) {
      startDate.setDate(startDate.getDate() + 30);
      endDate.setDate(startDate.getDate() + 60);
      mutate({
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        eventId,
      });
    }
  };

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <MagnifyingGlassIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="m-5 h-[95%] w-[90%] rounded-lg bg-gray-50 sm:w-[600px]"
      >
        <SheetHeader>
          <div className="flex items-center">
            <Avatar className="mr-2 border border-black bg-[#ebebeb]">
              <AvatarImage
                src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${contact.username}`}
                className="grayscale"
              />

              <AvatarFallback>{contact.username[0]}</AvatarFallback>
            </Avatar>
            <Badge variant="secondary">{contact.tag}</Badge>
          </div>
          <div className="ml-2">
            <div className="flex flex-col items-start">
              <p>{contact.name}</p>
              <div className="flex items-center">
                <p className="mr-2 font-cal">{contact.username}</p>
                <Link
                  href={`https://cal.com/${contact.username}`}
                  className="mt-1 text-xs text-gray-500"
                >
                  https://cal.com/{contact.username}
                </Link>
              </div>
            </div>
          </div>
        </SheetHeader>
        <Separator className="my-3" />
        <SheetDescription>
          👋 Hey! Meet your buddy <strong>{contact.username}</strong>. He&apos;s
          a{" "}
          {contact.tag === "Friends"
            ? "friend"
            : contact.tag === "Family"
              ? "relative"
              : "coworker"}{" "}
          of yours and he&apos;s often around. You two may have a common free
          time to chat... Wanna check if he&apos;s available? 📆{" "}
        </SheetDescription>
        <Separator className="my-3" />
        {showEventTypes ? (
          <div>
            <Button
              variant="link"
              onClick={() => setShowEventTypes(false)}
              disabled={isPending}
              size="sm"
            >
              {isPending && <ReloadIcon className="mr-2 animate-spin" />}
              {isPending ? "Booking 😁..." : "Go Back"}
            </Button>
            <div className="mt-36 flex w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <h1 className="mb-2 font-cal text-xl">
                  Available events to check in
                </h1>
                <p className="mb-3 text-center">
                  Click one of the options and we are going to do all the job
                  for you 🙂
                </p>
                <ul className="w-full">
                  {isPending && (
                    <div className="flex w-full items-center justify-center">
                      <ReloadIcon className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                  {!isPending && (
                    <>
                      {data?.map((event) => (
                        <li
                          key={event.id}
                          className="flex w-full flex-col items-center justify-between"
                        >
                          <EventsPopover
                            calId={event.calId!}
                            title={event.title}
                            isPending={isPending}
                            checkAvailabilityAndBook={checkAvailabilityAndBook}
                          />
                          <Link
                            target="_blank"
                            href={`https://cal.com/${contact.username}/${event.slug}`}
                            className="w-full text-left text-xs text-gray-500"
                          >
                            <small>
                              cal.com/{contact.username}/{event.slug}
                            </small>
                          </Link>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-48 flex w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <CalendarIcon className="h-6 w-6" />
              <h1 className="my-2 max-w-md text-center font-cal text-xl">
                This is pretty empty...
              </h1>

              <h3 className="mb-3 max-w-[19rem] text-center text-sm text-gray-500">
                How come you haven&apos;t booked with this person in a long
                time? 🤨... Let&apos;s annoy! 🚀
              </h3>
              <Button size="sm" onClick={() => setShowEventTypes(true)}>
                Check in
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

const EventsPopover = ({
  isPending,
  checkAvailabilityAndBook,
  calId,
  title,
}: {
  isPending: boolean;
  checkAvailabilityAndBook: (arg0: MeetTime, arg1: number) => void;
  calId: number;
  title: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover modal={true} onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button disabled={isPending} variant="outline" className="w-full ">
          {isPending && <ReloadIcon className="mr-2 animate-spin" />}

          {!isPending && <CalendarIcon className="mr-2 h-4 w-4" />}
          {!isPending ? title : "Booking 🙂..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-[22rem] flex-col space-y-2 p-2"
      >
        <Button
          onClick={() => checkAvailabilityAndBook(MeetTime.Today, calId)}
          variant="ghost"
          value="0"
        >
          Today
        </Button>
        <Button
          variant="ghost"
          value="1"
          onClick={() => checkAvailabilityAndBook(MeetTime.Tomorrow, calId)}
        >
          Tomorrow
        </Button>
        <Button
          variant="ghost"
          value="3"
          onClick={() => checkAvailabilityAndBook(MeetTime.In3Days, calId)}
        >
          In 3 days
        </Button>
        <Button
          variant="ghost"
          value="7"
          onClick={() => checkAvailabilityAndBook(MeetTime.InAWeek, calId)}
        >
          In a week
        </Button>

        <Button
          variant="ghost"
          value="7"
          onClick={() => checkAvailabilityAndBook(MeetTime.InAMonth, calId)}
        >
          In a month
        </Button>
      </PopoverContent>
    </Popover>
  );
};
