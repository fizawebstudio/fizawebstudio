const items = [
  'Web Design', 'Brand Identity', 'UI/UX', 'Motion Design',
  'E-Commerce', 'Mobile Apps', 'SEO', 'Prototyping',
  'Design Systems', 'Art Direction',
];

export default function Marquee() {
  return (
    <div className="relative py-6 border-y border-ink-100 overflow-hidden bg-ink-50">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-8 mx-8">
            <span className="font-display font-semibold text-xl lg:text-2xl text-ink-300 hover:text-accent-500 transition-colors duration-300 cursor-default">
              {item}
            </span>
            <span className="text-accent-500 text-xl">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
