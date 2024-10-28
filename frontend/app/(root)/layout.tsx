import Header from '@/components/shared/Header/Header';
import Footer from '@/components/shared/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </>
  );
}
