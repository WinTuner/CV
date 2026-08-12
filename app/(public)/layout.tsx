import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id="main" className="relative min-h-screen">
      <div className="relative z-10">
        <Header />
        {children}
        <Footer />
      </div>
    </main>
  );
}
