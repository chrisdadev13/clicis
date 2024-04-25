"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ReloadIcon } from "@radix-ui/react-icons";
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
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { z } from "zod";

const apiKeyRegex = /^cal_live_[0-9a-fA-F]{32}$/;

const formSchema = z.object({
  calApiKey: z.string().regex(apiKeyRegex, {
    message: "Invalid Cal.com Api Key",
  }),
});

export default function GettingStartedForm() {
  const router = useRouter();

  const { toast } = useToast();
  const { mutate, isPending } = api.users.setup.useMutation({
    onSuccess: () => {
      router.push("/contacts");
      router.refresh();
    },
    onError: (opts) => {
      console.log(opts);
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
      calApiKey: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ calApiKey: values.calApiKey });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="calApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cal.com Api Key</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  defaultValue=""
                  placeholder="cal_live_c8d988bc7ed850dad92cccb440cc6ffa"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We need your <span className="font-cal">Cal.com</span> Api-key
                to authenticate your account and improve your experience in the
                platform.{" "}
                <Link
                  href="https://app.cal.com/settings/developer/api-keys"
                  className="text-blue-800"
                  target="_blank"
                >
                  How to get it?
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-center">
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue {!isPending && <ArrowRightIcon className="ml-3" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
