import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { stats } from '@/data';

const roles = ['WordPress Developer', 'Shopify Developer', 'Freelance Web Developer', 'eCommerce Website Developer'];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText.length < current.length) {
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, displayText.length + 1));
      }, 80);
    } else if (!isDeleting && displayText.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, displayText.length - 1));
      }, 40);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-36 pb-12 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent-500/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-accent-300/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-7 space-y-5">
            {/* <div className="inline-flex items-center px-4 py-[0.3rem] rounded-full bg-white border border-ink-100 text-xs font-medium text-ink-600 animate-fade-down">
              Available for new projects
            </div> */}
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>Available for projects</span>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent-500 animate-fade-up animation-delay-100">
              Freelance Web Developer
            </p>
            <h1 className="w-[90%] lg:w-[calc(90%+3rem)] font-display font-bold text-[clamp(1.5rem,7vw,2.25rem)] lg:text-[clamp(2.25rem,3vw,2.75rem)] leading-[1.3] tracking-tight text-ink-900 animate-fade-up animation-delay-100">
              Websites That Help Your <span className="text-accent-500 hover:scale-105 transition-transform duration-300 cursor-default">Business Grow </span>
            </h1>

            <p className="text-base text-ink-400 max-w-xl leading-relaxed animate-fade-up animation-delay-200">
              I’m Fiza Asif, a freelance web developer specializing in WordPress, Shopify and eCommerce development. I build modern, responsive and SEO-friendly websites that help businesses present their brand professionally and give customers a better online experience.
            </p>

            <div className="flex flex-wrap items-center gap-4 animate-fade-up animation-delay-300">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 text-white font-semibold text-sm hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                View My Work
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-ink-200 text-ink-700 font-semibold text-sm hover:border-accent-400 hover:text-accent-500 hover:-translate-y-0.5 transition-all duration-300"
              >
                Start a Project
                <ArrowRight size={18} />
              </a>
            </div>

            <p className="text-xs text-ink-500 animate-fade-up animation-delay-300">
              WordPress websites, Shopify stores, landing pages, redesigns and website optimization tailored to your goals.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ink-100 animate-fade-up animation-delay-400">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="cursor-default hover:-translate-y-1 transition-transform duration-300"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className={`font-display font-bold text-ink-900 hover:text-accent-500 transition-colors duration-300 ${
                    stat.value === 'WordPress + Shopify' || stat.value === 'SEO-Friendly'
                      ? 'text-sm lg:text-base'
                      : 'text-2xl lg:text-base'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-ink-400 mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-5 relative animate-scale-in animation-delay-300">
            <div className="relative max-w-sm mx-auto">
              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-ink-100 aspect-[4/5] animate-glow-pulse">
                <img
                  src="/fiza.png"
                  alt="Creative workspace"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent-700/35 via-accent-500/10 to-transparent" />
              </div>

              {/* Rating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-ink-100 p-4 animate-float-card">
                <div className="flex items-center gap-1 mb-1.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={12} className="fill-warm-500 text-warm-500" />
                  ))}
                </div>
                <div className="text-xs font-bold text-ink-900">5.0 Rating</div>
                <div className="text-[10px] text-ink-400">From 20+ clients</div>
              </div>

              {/* Experience card */}
              <div className="absolute -top-4 -right-4 bg-ink-900 rounded-2xl shadow-xl p-4 text-center animate-float-card" style={{ animationDelay: '1.5s' }}>
                <div className="font-display font-bold text-sm lg:text-base text-accent-400">5+</div>
                <div className="text-[10px] text-ink-300 font-medium">Years Exp.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
