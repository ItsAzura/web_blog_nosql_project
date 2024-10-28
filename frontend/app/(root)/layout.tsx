// import Footer from '@/components/Footer/Footer';
// import Header from '@/components/Header/Header';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <body>
        {/* <Header /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </>
  );
}
