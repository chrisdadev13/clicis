import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Marketing() {
  return (
    <main>
      <section
        id="hero"
        className="relative mx-auto flex w-full max-w-7xl flex-col-reverse justify-center gap-8 overflow-hidden px-6 pb-16 pt-0 md:px-[34px] md:pb-28 lg:grid lg:grid-cols-2 lg:px-8 lg:pt-14 xl:!px-36"
      >
        <div className="z-1 mx-auto mt-10 max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-20">
          <h1 className="md:!leading-h1 pb-9 font-cal text-[40px] leading-[100%] md:text-5xl lg:text-[50px] xl:text-6xl">
            Effortless Check-Ins, Meaningful Connections
          </h1>
          <p className="pb-9 text-2xl">
            Never Miss a Beat with Your People. Check In with Ease using Your
            Cal.com Account!
          </p>
          <div className="flex gap-6">
            <Button
              asChild
              className="w-full rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition ease-in-out hover:shadow-[6px_6px_0px_0px_rgba(0,0,0)] md:w-40"
            >
              <Link href="/login">Start Now</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link target="_blank" href="https://cal.com">
                Go to Cal.com
              </Link>
            </Button>
          </div>
          <small>
            *You&apos;ll need a <span className="font-cal">Cal.com</span>{" "}
            account to use this tool properly
          </small>
        </div>
        <div className="mx-auto flex max-w-2xl sm:mt-24 md:mt-16 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none">
          <Image
            src="/features.png"
            height={500}
            width={500}
            alt="features example"
          />
        </div>
      </section>
      <section className="flex w-full items-center justify-center">
        <p className="font-cal text-xl font-black">
          Perfect if you use and like Cal.com
        </p>
      </section>
      <section
        id="cta"
        className="mx-3 mt-20 rounded-xl border border-white bg-primary p-5 text-center text-gray-200"
      >
        <h3 className="font-cal text-5xl font-black">How it works?</h3>
        <h3 className="my-8 font-cal text-xl">
          The Check-In App that works with Cal.com
        </h3>
        <h3 className="text-center font-cal text-xl md:mx-auto md:max-w-lg">
          This way we suggest perfect times to reconnect with friends, family,
          and colleagues
        </h3>
        <Button
          variant="secondary"
          className="mt-5 w-full rounded-xl bg-gray-200 font-cal shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition ease-in-out hover:shadow-[6px_6px_0px_0px_rgba(0,0,0)] md:w-40"
          asChild
        >
          <Link href="/login">Start using it now!</Link>
        </Button>
      </section>
    </main>
  );
}

// Examples
// const RandomCheckInExample = () => (
//   <Card className="absolute right-96 top-48 w-96 border border-black">
//     <CardHeader className="flex flex-row items-center ">
//       <Avatar className="border border-black bg-[#ebebeb]">
//         <AvatarImage
//           src="https://api.dicebear.com/8.x/open-peeps/svg?seed=mark"
//           className="grayscale"
//         />
//         <AvatarFallback>M</AvatarFallback>
//       </Avatar>
//       <p className="mx-2 font-cal">mark</p>
//       <Badge variant="secondary">Friend</Badge>
//       <p className="ml-2 text-sm">Often</p>
//     </CardHeader>
//     <CardContent>
//       <p className="text-sm">
//         👋 Hey! Meet your buddy <strong>Mark</strong>. He&apos;s a friend of
//         yours and he&apos;s often around. You two have a common free time to
//         chat.
//       </p>
//     </CardContent>
//     <CardFooter>
//       <small className="text-sm">
//         📆 Here is the time you both can chat...
//       </small>
//     </CardFooter>
//   </Card>
// );
//
// const CalComIntegration = () => (
//   <Card className="absolute right-72 top-96 z-50 w-80 border border-black">
//     <h1 className="ml-8 mt-2 font-cal">Integrate with Cal.com</h1>
//     <CardHeader className="-mb-5 -mt-5 flex flex-row items-center justify-center text-sm text-gray-500">
//       <p>Mon 21</p>
//       <p className="mx-10 mb-2">Tue 22</p>
//       <p className="mb-3">Wed 23</p>
//     </CardHeader>
//     <CardContent className="grid grid-cols-3">
//       <Button variant="outline" size="sm">
//         11:30
//       </Button>
//       <Button variant="outline" size="sm" className="mx-3">
//         11:30
//       </Button>
//       <Button variant="outline" size="sm">
//         11:30
//       </Button>
//       <Button variant="outline" className="my-2" size="sm">
//         12:30
//       </Button>
//       <Button variant="outline" className="mx-3 my-2" size="sm">
//         12:30
//       </Button>
//       <Button variant="outline" className="my-2" size="sm">
//         12:30
//       </Button>
//       <Button size="sm" variant="outline">
//         13:30
//       </Button>
//       <Button size="sm" variant="outline" className="mx-3">
//         13:30
//       </Button>
//       <Button size="sm" variant="outline">
//         13:30
//       </Button>
//     </CardContent>
//   </Card>
// );
//
// const AddContactFromCalCom = () => (
//   <Card className="absolute bottom-28 right-96 w-[26rem] border border-black">
//     <CardHeader>
//       <h1 className="font-cal">Check-in</h1>
//       <p className="text-sm">
//         Add your favourites Cal.com links and make irregular check-ins with
//         friends, family members and coworkers
//       </p>
//     </CardHeader>
//     <CardContent>
//       <div className="flex items-center">
//         <Input
//           type="text"
//           className="mr-2 h-8"
//           placeholder="https://cal.com/chrisdadev"
//         />
//         <Select>
//           <SelectTrigger className="h-8 w-[180px]">
//             <SelectValue placeholder="Frequency" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="often">Often</SelectItem>
//             <SelectItem value="every-now">Every now</SelectItem>
//             <SelectItem value="rarely">Rarely</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="mt-2 flex items-center">
//         <Input
//           type="text"
//           className="mr-2 h-8"
//           placeholder="https://cal.com/rick"
//         />
//         <Select>
//           <SelectTrigger className="h-8 w-[180px]">
//             <SelectValue placeholder="Frequency" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="often">Often</SelectItem>
//             <SelectItem value="every-now">Every now</SelectItem>
//             <SelectItem value="rarely">Rarely</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="flex items-center">
//         <Button size="sm" className="mr-2 mt-2">
//           Add new contact
//         </Button>
//         <Button size="sm" variant="ghost" className="mr-2 mt-2">
//           Import CSV
//         </Button>
//       </div>
//     </CardContent>
//   </Card>
// );
