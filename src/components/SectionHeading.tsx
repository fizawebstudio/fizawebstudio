import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  titleClassName?: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({ eyebrow, title, titleClassName, description, center = true }: SectionHeadingProps) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 ${center ? 'items-center text-center' : 'items-start text-left'} ${
        visible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="inline-flex  items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-accent-500">
          {eyebrow}
        </span>
      </div>
      <h2 className={`font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-ink-900 max-w-3xl ${titleClassName ?? 'leading-[1.2]'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base text-ink-500 max-w-3xl leading-relaxed ${center ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
}
