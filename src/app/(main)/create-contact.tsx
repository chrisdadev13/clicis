"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckInTime } from "@prisma/client";
import { CheckCircledIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { CalUrlSchema } from "@/server/api/routers/contacts/create.schema";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { z } from "zod";

import { useRouter } from "next/navigation";

const formSchema = z.object({
  identifier: CalUrlSchema,
  name: z.string().min(1).max(100),
  checkInFrequency: z.nativeEnum(CheckInTime),
  tags: z.string(),
});

export function CreateContact() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const { toast } = useToast();

  const { mutate, isPending } = api.contacts.create.useMutation({
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      name: "",
      checkInFrequency: CheckInTime.Rarely,
      tags: "Family",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      identifier: values.identifier,
      name: values.name,
      tag: values.tags,
      checkInFrequency: values.checkInFrequency,
    });
  }

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="mr-3 text-sm">
          <PlusIcon className="mr-2" />
          New Contact
        </Button>
      </SheetTrigger>
      <SheetContent className="m-5 h-[95%] w-[90%] rounded-lg bg-gray-50 sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Add a new contact</SheetTitle>
          <SheetDescription>
            Add a contact to randomly check in with
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 py-2">
              <div className="grid grid-rows-2 items-center gap-2">
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex items-center text-left font-cal">
                          Contact Name
                        </FormLabel>
                        <Input
                          placeholder="Rick Roll"
                          className="col-span-3 mr-2"
                          value={field.value}
                          onChange={field.onChange}
                          ref={field.ref}
                          name={field.name}
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col items-center sm:flex-row">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex items-center text-left font-cal">
                          Cal.com url <FormMessage className="ml-1" />
                        </FormLabel>
                        <FormDescription className="text-xs">
                          You can only add personal{" "}
                          <span className="font-cal">Cal.com</span> links. No
                          teams 😡 yet
                        </FormDescription>
                        <Input
                          placeholder="https://cal.com/rick/get-rick-rolled"
                          className="col-span-3 mr-2"
                          value={field.value.toLowerCase().trim()}
                          onChange={field.onChange}
                          ref={field.ref}
                          name={field.name}
                          disabled={field.disabled}
                          onBlur={field.onBlur}
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checkInFrequency"
                    render={({ field }) => (
                      <FormItem className="ml-2 mt-3 w-full sm:mt-12 sm:w-32">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Often">Often</SelectItem>
                            <SelectItem value="Occasionally">
                              Ocassionally
                            </SelectItem>
                            <SelectItem value="Rarely">Rarely</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-cal">Tags</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={"Family"}
                        >
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
                </div>
              </div>
            </div>
            <SheetFooter>
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
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
