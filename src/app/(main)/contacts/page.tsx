import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CreateContact } from "../create-contact";
import { api } from "@/trpc/server";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import FrequencySelect from "./frequency-select";
import DeleteModal from "./delete-modal";
import UpdateContact from "./update-contact-modal";
import ContactSheet from "./contact-sheet";

export default async function Contacts() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user && !session.user.username) {
    redirect("/getting-started");
  }

  const contacts = await api.contacts.list();

  if (contacts.length === 0) {
    return (
      <div className="flex w-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image src="/empty.png" alt="Empty state" width={500} height={500} />
          <h1 className="my-2 max-w-md text-center font-cal text-2xl">
            Hi {session.user.name!.split(" ")[0]}, is nice to see you
          </h1>
          <h3 className="mb-3 max-w-md text-center text-xl text-gray-500">
            You don&apos;t have any contact right now, to add one click the
            button below
          </h3>
          <CreateContact />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full text-left font-cal text-4xl">List of Contacts</h1>
        <CreateContact />
      </div>
      <Separator className="my-3" />
      <ul className="w-full">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="mb-1 w-full cursor-pointer rounded-lg border border-primary bg-white hover:bg-gray-100"
          >
            <div className="group flex w-full max-w-full items-center justify-between overflow-hidden px-4 py-4 sm:px-6">
              <div className="flex flex-1 items-center">
                <Avatar className="border border-black bg-[#ebebeb]">
                  <AvatarImage
                    src={`https://api.dicebear.com/8.x/open-peeps/svg?seed=${contact.username}`}
                    className="grayscale"
                  />

                  <AvatarFallback>{contact.username[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <div className="flex items-center">
                    <p className="mr-2 font-cal">{contact.username}</p>
                    <Badge variant="secondary">{contact.tag}</Badge>
                  </div>
                  <Link
                    href={`https://cal.com/${contact.username}`}
                    className="text-xs text-gray-500"
                  >
                    https://cal.com/{contact.username}
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <FrequencySelect
                  contactId={contact.id}
                  checkInFrequency={contact.checkInFrequency}
                />
                <ContactSheet contact={contact} />
                <UpdateContact
                  id={contact.id}
                  identifier={`cal.com/${contact.username}`}
                  tag={contact.tag}
                  name={contact.name}
                />
                <DeleteModal
                  id={contact.id}
                  username={contact.username}
                  tag={contact.tag}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
