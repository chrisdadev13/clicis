"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChartIcon, Link2Icon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LINKS_EXAMPLE = [
  {
    id: 1,
    url: "clic.is/dub",
    description: "The inspiration of this project 🐐",
    clicks: "4k",
    disabled: false,
  },
  {
    id: 2,
    url: "clic.is/booking",
    description: "If you want to book a meeting 📆",
    clicks: "2.1k",
    disabled: false,
  },
  {
    id: 3,
    url: "clic.is/oss",
    description: "If you want to check the code 🙌",
    clicks: 300,
    disabled: true,
  },
];

export default function Example() {
  return (
    <div className="flex w-screen flex-col items-center justify-center px-4">
      {LINKS_EXAMPLE.map((link) => {
        return (
          <Card
            key={link.id}
            className="mb-2 flex w-full items-center justify-between border border-black md:w-3/12"
          >
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Link
                  href={`https://${link.url}`}
                  target="_blank"
                  className="flex items-center"
                >
                  {" "}
                  <Link2Icon /> {link.url}
                </Link>
              </CardTitle>
              <div className="text-sm text-gray-600">
                {link.description}
                <Badge variant="secondary" className="mt-1">
                  <BarChartIcon className="mr-2" />
                  {link.clicks} Clicks
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="mt-5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch
                      checked={link.disabled}
                      className={cn(link.disabled ? "bg-gray-200" : "bg-black")}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Disable or Enable the link</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
