"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/trpc/react";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DeleteModal({
  id,
  username,
  tag,
}: {
  id: string;
  username: string;
  tag: string;
}) {
  const router = useRouter();

  const { mutate, isPending } = api.cal.delete.useMutation({
    onSuccess: async () => {
      console.log("Hello");
      router.refresh();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-destructive hover:text-white"
          size="sm"
        >
          {" "}
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-cal">Cancel Check-in?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p> Are you sure you want to cancel this check-in?</p>
          <div className="mt-5 flex items-center">
            <Avatar className="border border-black bg-[#ebebeb] ">
              <AvatarFallback>{username[0]}</AvatarFallback>
              <AvatarImage
                src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${username}`}
                className=" grayscale"
              />
            </Avatar>
            <div className="ml-2">
              <div className="flex items-center">
                <p className="mr-2 font-cal">{username}</p>
                <Badge variant="secondary">{tag}</Badge>
              </div>
              <Link
                href={`https://cal.com/${username}`}
                className="text-xs text-gray-500"
              >
                https://cal.com/{username}
              </Link>
            </div>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button variant="ghost">Go Back</Button>
          <Button
            variant="destructive"
            onClick={() => {
              console.log("delete");
              mutate({ id });
            }}
            disabled={isPending}
          >
            {isPending ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
