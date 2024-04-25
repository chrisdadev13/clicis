import UserItem from "./user-item";
import Navigation from "./navigation";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="-mr-1 font-cal text-2xl">
            clic <span className="font-sans">/</span>
          </h1>
          <Navigation />
        </div>
        <UserItem />
      </div>
      <Separator className="mt-2" />
    </div>
  );
}
