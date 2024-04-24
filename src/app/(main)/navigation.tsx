"use client";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PersonIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="mb-1 lg:mb-0">
        <Button variant="link" role="combobox" aria-label="Select a team">
          {pathname === "/contacts" ? "Contacts" : "Check-ins"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-2 text-left">
        <Button
          onClick={() => setOpen(false)}
          size="sm"
          variant="ghost"
          className={cn(
            "flex-start my-1 flex w-full items-center justify-start text-left text-sm",
            pathname === "/contacts" ? "bg-secondary" : "",
          )}
          asChild
        >
          <Link href="/contacts">
            <PersonIcon className="mr-2" /> Contacts
          </Link>
        </Button>
        <Button
          onClick={() => setOpen(false)}
          size="sm"
          variant="ghost"
          className={cn(
            "flex-start my-1 flex w-full items-center justify-start text-left text-sm",
            pathname === "/check-ins" ? "bg-secondary" : "",
          )}
          asChild
        >
          <Link href="/check-ins">
            <CalendarIcon className="mr-2" /> Check-ins
          </Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
