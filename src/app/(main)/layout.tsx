import Header from "./header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      <div className="mx-2 mt-20 sm:mx-5">{children}</div>
    </main>
  );
}
