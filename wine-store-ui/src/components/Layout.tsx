// src/components/Layout.tsx
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Header – uvek na vrhu */}
      <Header />

      {/* Glavni sadržaj stranice */}
      <main className="container-wide" style={{ padding: "2rem 0" }}>
        {children}
      </main>

      {/* Footer – uvek na dnu */}
      <Footer />
    </>
  );
}
