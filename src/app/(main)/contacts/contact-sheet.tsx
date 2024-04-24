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
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
export default function ContactSheet({
  contact,
}: {
  contact: {
    id: string;
    username: string;
    name: string;
    tags: { name: string }[];
    checkInFrequency: string;
  };
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <MagnifyingGlassIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="m-5 h-[95%] w-[600px] rounded-lg bg-gray-50"
      >
        <SheetHeader>
          <div className="flex items-center">
            <Avatar className="mr-2 border border-black bg-[#ebebeb]">
              <AvatarImage
                src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${contact.username}`}
                className="grayscale"
              />

              <AvatarFallback>{contact.username[0]}</AvatarFallback>
            </Avatar>
            <Badge variant="secondary">{contact.tags.at(-1)!.name}</Badge>
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
          <p>
            👋 Hey! Meet your buddy <strong>{contact.username}</strong>.
            He&apos;s a{" "}
            {contact.tags.at(-1)!.name === "Friends"
              ? "friend"
              : contact.tags.at(-1)!.name === "Family"
                ? "relative"
                : "coworker"}{" "}
            of yours and he&apos;s often around. You two may have a common free
            time to chat... Wanna check if he&apos;s available? 📆{" "}
          </p>
        </SheetDescription>
        <Separator className="my-3" />
        <div className="mt-48 flex w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <CalendarIcon className="h-6 w-6" />
            <h1 className="my-2 max-w-md text-center font-cal text-xl">
              This is pretty empty...
            </h1>

            <h3 className="mb-3 max-w-[19rem] text-center text-sm text-gray-500">
              How come you haven&apos;t booked with this person in a long time?
              🤨... Let&apos;s annoy! 🚀
            </h3>
            <Button size="sm">Check in</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="secondary"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Check Availability</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
