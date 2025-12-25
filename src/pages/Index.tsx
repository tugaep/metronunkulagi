import { MetroProvider } from '@/context/MetroContext';
import { Header } from '@/components/Header';
import { LineSelector } from '@/components/LineSelector';

import { Footer } from '@/components/Footer';

import { InlineSubmitForm } from '@/components/InlineSubmitForm';

const IndexContent = () => {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container px-4 pb-24 flex-1">
        {/* Selection Area */}
        <section className="py-4 border-b border-border/50">
          <LineSelector />
          <InlineSubmitForm />
        </section>


      </main>
      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <MetroProvider>
      <IndexContent />
    </MetroProvider>
  );
};

export default Index;
