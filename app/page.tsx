import { Header } from '@/components/home/header';
import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';
import { Footer } from '@/components/home/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
