"use client";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogOut() {
  const [isLoading, setIsLoading] = useState(false);
  const confirmSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#f9fafc]">
      <div className="relative z-20 m-auto flex w-full max-w-[400px] flex-col rounded-xl bg-white shadow-md">
        <div className="flex w-full flex-col  p-12">
          <h1 className="mb-2 text-left font-cal text-3xl font-extrabold">
            We can&apos;t wait to see you again
          </h1>
          <p className="mb-3 flex items-center">
            Are you sure you want to sign out?
          </p>
          <Button
            size="default"
            className="w-full"
            onClick={() => confirmSignOut()}
            disabled={isLoading}
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Bye..." : "Sign out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
