import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref, visible } = useScrollReveal();

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 bg-ink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Heading */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-accent-500">
                  Testimonials
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-ink-900 leading-[1.2] mb-4">
                Kind words from <span className="text-accent-500">happy clients</span>
              </h2>
              <p className="text-base text-ink-500 leading-relaxed mb-6">
                Hear from clients about their experience working with me and the results delivered through each project.
              </p>

              {/* Small client cards */}
              <div className="grid grid-cols-2 gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(i)}
                    className={`text-left p-2 rounded-xl border transition-all duration-300 ${
                      i === active
                        ? 'bg-white border-accent-500/30 shadow-md'
                        : 'bg-transparent border-ink-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={t.avatar} alt={t.name} className="w-7 h-7 shrink-0 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-ink-900 truncate">{t.name}</div>
                        <div className="text-[10px] text-ink-400 truncate">{t.role}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Testimonial display */}
          <div ref={ref} className={`lg:col-span-8 ${visible ? 'animate-fade-up' : 'opacity-0'}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-ink-100">
              <Quote size={40} className="absolute top-6 right-8 text-accent-500/10" />

              <div className="relative">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-warm-500 text-warm-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base lg:text-lg text-ink-700 leading-relaxed mb-6 font-display font-light">
                  "{testimonials[active].text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonials[active].avatar}
                    alt={testimonials[active].name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-accent-500/20"
                  />
                  <div>
                    <div className="font-display font-semibold text-ink-900">
                      {testimonials[active].name}
                    </div>
                    <div className="text-sm text-ink-400">{testimonials[active].role}</div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-ink-100">
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? 'w-6 bg-accent-500' : 'w-1.5 bg-ink-200'
                      }`}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="w-9 h-9 rounded-lg border border-ink-100 flex items-center justify-center text-ink-600 hover:text-accent-500 hover:border-accent-400 transition-all"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    className="w-9 h-9 rounded-lg border border-ink-100 flex items-center justify-center text-ink-600 hover:text-accent-500 hover:border-accent-400 transition-all"
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
