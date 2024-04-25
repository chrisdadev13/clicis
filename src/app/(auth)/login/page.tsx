"use client";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const signInWithGoogle = async () => {
    setIsLoading(true);
    await signIn("google", { redirect: true, callbackUrl: "/contacts" });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#f9fafc]">
      <div className="relative z-20 m-auto flex w-full max-w-[400px] flex-col rounded-xl bg-white shadow-md">
        <div className="flex w-full flex-col  p-12">
          <h1 className="mb-2 text-left font-cal text-2xl font-extrabold">
            Welcome to clic
          </h1>
          <p className="mb-3 ">
            A simple and minimalist tool to help you manage your{" "}
            <span className="font-cal">Cal.com</span> favorite contacts{" "}
          </p>
          <div className="w-full">
            <Button
              size="default"
              className="w-full"
              onClick={() => signInWithGoogle()}
              disabled={isLoading}
            >
              {!isLoading ? (
                <Google className="mr-2 h-4 w-4" />
              ) : (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {!isLoading ? "Continue with Google" : "Signing in..."}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Google = ({ className }: { className: string }) => (
  <svg role="img" viewBox="0 0 24 24" className={className}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    />
  </svg>
);
