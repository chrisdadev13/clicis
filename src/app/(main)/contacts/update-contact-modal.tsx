"use client";

import React from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CalUrlSchema } from "@/server/api/routers/contacts/create.schema";
import {
  CheckCircledIcon,
  Pencil2Icon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  identifier: CalUrlSchema.optional(),
  name: z.string().min(1).max(100).optional(),
  tag: z.string(),
});

export default function UpdateContact({
  id,
  name,
  identifier,
  tag,
}: {
  id: string;
  name: string;
  identifier: string;
  tag: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: identifier,
      name: name,
      tag: tag,
    },
  });

  const { mutate, isPending } = api.contacts.update.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (opts) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: opts.message,
        duration: 3000,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      id: id,
      name: values.name,
      identifier: values.identifier === "" ? null : values.identifier,
      tag: values.tag,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit contact</DialogTitle>
          <DialogDescription>
            Make changes to the contact here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel
                      htmlFor="name"
                      className="mr-2 text-left font-cal text-xs"
                    >
                      Contact name
                    </FormLabel>
                    <Input className="w-full" id="name" {...field} />
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identifier"
                disabled
                render={({ field }) => (
                  <FormItem className="mt-3 flex w-full flex-col">
                    <FormLabel
                      htmlFor="name"
                      className="mr-2 text-left font-cal text-xs"
                    >
                      Cal.com url (WIP)
                    </FormLabel>
                    <Input
                      className="w-full"
                      id="name"
                      defaultValue="Pedro Duarte"
                      {...field}
                    />
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem className="mt-3 flex flex-col">
                    <FormLabel className="mr-2 font-cal text-xs">
                      Tags
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={tag}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tags" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Friends">Friends</SelectItem>
                        <SelectItem value="Coworkers">Coworkers</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-3">
                <Button
                  disabled={isPending}
                  variant="secondary"
                  className="w-full"
                  type="submit"
                >
                  {isPending ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {!isPending && <CheckCircledIcon className="mr-2" />} Save
                  Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
