import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import GettingStartedForm from "./form";

export default async function GettingStarted() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.apiKey) {
    const validApiKey = await api.cal.validateApiKey({
      apiKey: session.user.apiKey,
    });

    if (validApiKey) {
      redirect("/contacts");
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="mb-5 font-cal text-4xl font-black">Getting Started</h1>
      <section className="rounded-lg bg-white p-10  xl:w-[28%]">
        <div className="mb-3 ">
          <h1 className="font-cal text-2xl">Let&apos;s set up your account</h1>
          <p className="mb-2 text-gray-500">
            Introduce your <span className="font-cal">Cal.com</span> Api key to
            get started.
          </p>
        </div>
        <GettingStartedForm />
      </section>
    </div>
  );
}
