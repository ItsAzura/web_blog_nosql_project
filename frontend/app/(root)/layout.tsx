import Header from '@/components/shared/Header/Header';
import Footer from '@/components/shared/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>
        <div className="p-8 bg-[url('/bg.jpg')] bg-cover bg-center shadow-lg min-h-screen space-y-10">
          <Header />
          {children}
          <Footer />
        </div>
      </main>
    </>
  );
}
