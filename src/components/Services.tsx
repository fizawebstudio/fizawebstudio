import {
  Palette, Monitor, Smartphone, ShoppingBag, Sparkles, Search,
  ArrowUpRight, Check, type LucideIcon,
} from 'lucide-react';
import { services, processSteps } from '@/data';
import SectionHeading from './SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const iconMap: Record<string, LucideIcon> = {
  Palette, Monitor, Smartphone, ShoppingBag, Sparkles, Search,
};

export default function Services() {
  return (
    <section id="services" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Services"
          title={<>Web development services built around <span className="text-accent-500">your goals</span></>}
          description="Modern, responsive and SEO-friendly websites for businesses, founders and online brands that need a clear digital presence."
        />

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Sparkles;
            return <ServiceCard key={service.id} service={service} Icon={Icon} index={i} />;
          })}
        </div>

      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Process"
          title={<>A simple <span className="text-accent-500">4-step process</span></>}
          description="From the first conversation to launch, every step is planned around your goals, functionality and website needs."
        />

        <div className="relative mt-14">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-accent-500/10 via-accent-500/30 to-accent-500/10" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <ProcessCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  Icon,
  index,
}: {
  service: typeof services[0];
  Icon: LucideIcon;
  index: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden bg-white border border-ink-100 hover:border-accent-500/30 hover:shadow-xl transition-all duration-400 ${
        visible ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Service image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />

        {/* Icon badge */}
        <div className="absolute bottom-3 left-4 w-12 h-12 rounded-xl bg-white shadow-md border-ink-100 flex items-center justify-center group-hover:bg-accent-500 transition-colors duration-300">
          <Icon size={22} className="text-accent-500 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-3">
        <h3 className="font-display font-bold text-lg text-ink-900 mb-1.5 group-hover:text-accent-500 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-ink-500 leading-relaxed mb-4">
          {service.description}
        </p>

        <ul className="space-y-1.5 mb-4">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-ink-600">
              <Check size={13} className="text-accent-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <span className="text-xs font-semibold text-ink-700">{service.price}</span>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 group-hover:bg-accent-500 group-hover:text-white transition-all duration-300"
          >
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

function ProcessCard({ step, index }: { step: typeof processSteps[0]; index: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`relative text-center ${visible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Number circle */}
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full bg-white border-2 border-ink-100 group-hover:border-accent-500 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-xl text-accent-500">{step.number}</span>
        </div>
      </div>

      <h4 className="font-display font-semibold text-base text-ink-900 mb-1.5">
        {step.title}
      </h4>
      <p className="text-sm text-ink-500 leading-relaxed max-w-[200px] mx-auto">
        {step.description}
      </p>
    </div>
  );
}
