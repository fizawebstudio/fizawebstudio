import { useState } from 'react';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import { faqs } from '@/data';
import SectionHeading from './SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section id="faq" className="relative py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Questions? <span className="text-accent-500">I've got answers</span></>}
          description="A few common questions about website development, redesigns, eCommerce and ongoing website support."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              index={i}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 relative rounded-2xl overflow-hidden bg-ink-900 p-8 lg:p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent" />
          <div className="relative">
            <h4 className="font-display font-bold text-xl lg:text-2xl text-white mb-2">
              Still Have a Question?
            </h4>
            <p className="text-sm text-ink-300 mb-5 max-w-xl mx-auto">
              Have a project in mind or need help choosing the right website solution? Send me the details and I’ll help you figure out the next step.
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors"
            >
              Start a Project
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: typeof faqs[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen ? 'border-accent-500/20 shadow-md' : 'border-ink-100'
      } ${visible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className={`font-display font-semibold text-base transition-colors ${
          isOpen ? 'text-accent-500' : 'text-ink-900'
        }`}>
          {faq.question}
        </span>
        <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-accent-500 text-white' : 'bg-ink-100 text-ink-500'
        }`}>
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ${
          isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-5 text-sm text-ink-500 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}
