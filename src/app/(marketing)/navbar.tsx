import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <nav className="top-0 z-50 flex w-full max-w-[90rem] items-center justify-between px-5 py-2.5 pt-5 font-cal md:px-28 lg:top-0 lg:py-7 lg:backdrop-blur-0 xl:px-32">
      <div className="cursor-pointer selection:bg-black selection:text-white">
        <h1 className="text-3xl font-[1000]">clic</h1>
        <small className="font-cal text-sm">
          From &quot;Connect, List and Interact with Contacts&quot;
        </small>
      </div>
      <div>
        <Button size="lg" className="rounded-lg" variant="default">
          <Link
            href={session ? "/contacts" : "/login"}
            className="flex items-center"
          >
            {session ? "Dashboard" : "Try for free"}
          </Link>
        </Button>
      </div>
    </nav>
  );
}
