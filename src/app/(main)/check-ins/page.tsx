import { CalendarIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CheckIns() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user && !session.user.username) {
    redirect("/getting-started");
  }

  return (
    <div className="mt-64 flex w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <CalendarIcon className="h-12 w-12" />
        <h1 className="my-2 max-w-md text-center font-cal text-2xl">
          This is pretty empty...
        </h1>

        <h3 className="mb-3 max-w-md text-center text-xl text-gray-500">
          Check in with one of your contacts to change that... Let&apos;s annoy
          some people! 🚀
        </h3>

        <Button asChild size="lg">
          <Link href="/contacts">Check in</Link>
        </Button>
      </div>
    </div>
  );
}
