"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { api } from "@/trpc/react";

import { useRouter } from "next/navigation";

type Options = "Rarely" | "Occasionally" | "Often";

export default function FrequencySelect({
  contactId,
  checkInFrequency,
}: {
  contactId: string;
  checkInFrequency: string;
}) {
  const router = useRouter();

  const { contacts } = api.useUtils();

  const { mutate } = api.contacts.update.useMutation({
    onSuccess: async () => {
      await contacts.list.invalidate();
      router.refresh();
    },
  });

  return (
    <Select
      onValueChange={(value: Options) => {
        mutate({ id: contactId, checkInFrequency: value });
      }}
    >
      <SelectTrigger className="mr-1 w-32">
        <SelectValue placeholder={checkInFrequency} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Often">Often</SelectItem>
        <SelectItem value="Occasionally">Ocassionally</SelectItem>
        <SelectItem value="Rarely">Rarely</SelectItem>
      </SelectContent>
    </Select>
  );
}
