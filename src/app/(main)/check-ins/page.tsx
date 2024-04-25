import { CalendarIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getServerAuthSession } from "@/server/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/server/db";
import { DateTime } from "luxon";
import { Separator } from "@/components/ui/separator";

export default async function CheckIns() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user && !session.user.username) {
    redirect("/getting-started");
  }

  const checkIns = await db.checkIns.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      user: true,
      contact: true,
    },
  });

  if (checkIns.length === 0) {
    return (
      <div className="mt-64 flex  flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <CalendarIcon className="h-12 w-12" />
          <h1 className="my-2 max-w-md text-center font-cal text-2xl">
            This is pretty empty...
          </h1>

          <h3 className="mb-3 max-w-md text-center text-xl text-gray-500">
            Check in with one of your contacts to change that... Let&apos;s
            annoy some people! 🚀
          </h3>

          <Button asChild size="lg">
            <Link href="/contacts">Check in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full text-left font-cal text-4xl">Recent Check-ins</h1>
      </div>
      <Separator className="my-3" />
      <ul className="w-full">
        {checkIns.map((checkIn) => (
          <li
            key={checkIn.id}
            className="mb-1 w-full cursor-pointer rounded-lg border border-primary bg-white hover:bg-gray-100"
          >
            <div className="group flex w-full max-w-full items-center justify-between overflow-hidden px-4 py-4 sm:px-6">
              <div className="flex flex-1 items-center">
                <Avatar className="border border-black bg-[#ebebeb]">
                  <AvatarImage
                    src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${checkIn.contact.username}`}
                    className="grayscale"
                  />

                  <AvatarFallback>{checkIn.contact.username[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <div className="flex items-center">
                    <p className="mr-2 font-cal">{checkIn.contact.username}</p>
                    <Badge variant="secondary">{checkIn.contact.tag}</Badge>
                  </div>

                  <small>
                    {DateTime.fromISO(
                      checkIn.startDate.toISOString(),
                    ).toLocaleString({
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}

                    {" - "}
                    {DateTime.fromISO(
                      checkIn.endDate.toISOString(),
                    ).toLocaleString({
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </small>
                </div>
              </div>
              <div className="flex items-center">
                <Button size="sm">Book in Cal.com</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
