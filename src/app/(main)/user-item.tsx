"use server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import { ExitIcon, GearIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserItem() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  const { username, email } = session.user;

  if (!username) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-10 w-10 border border-black bg-[#ebebeb]">
          <AvatarFallback>{username[0]}</AvatarFallback>
          <AvatarImage
            src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${username}`}
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 text-left">
        <p className="text-sm">{username}</p>
        <p className="text-sm text-[#7b818e]">{email}</p>
        <Separator className="my-3" />
        <DropdownMenuItem className="cursor-pointer">
          <GitHubLogoIcon className="mr-2" />
          Star
        </DropdownMenuItem>
        <Button asChild size="sm" className="mt-3 w-full">
          <Link href="/logout">
            <ExitIcon className="mr-2" />
            Logout
          </Link>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
