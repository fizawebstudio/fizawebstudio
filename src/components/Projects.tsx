import { useState } from 'react';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { projects } from '@/data';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const categories = ['All', 'Web Design', 'E-Commerce', 'Shopify', 'Landing Page'];

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All'
    ? projects
    : projects.filter((project) => project.category === filter || project.tags.includes(filter));

  return (
    <section id="work" className="relative py-20 lg:py-28 bg-ink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Sticky heading + filters */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-accent-500">
                  Featured Projects
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-ink-900 leading-[1.2] mb-4">
                Explore my <span className="text-accent-500">latest projects</span>
              </h2>
              <p className="text-base text-ink-500 leading-relaxed mb-6">
                Explore a collection of websites I’ve designed and developed, built with a focus on modern design, smooth functionality, and a seamless user experience.  
              </p>

              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === cat
                        ? 'bg-accent-500 text-white'
                        : 'bg-white border border-ink-100 text-ink-600 hover:border-accent-400 hover:text-accent-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Project cards */}
          <div className="lg:col-span-8 space-y-6">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { ref, visible } = useScrollReveal();
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden bg-white border border-ink-100 hover:shadow-xl transition-all duration-400 ${
        visible ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`grid sm:grid-cols-5 gap-0 ${isEven ? '' : 'sm:[direction:rtl]'}`}>
        {/* Image */}
        <div className="relative sm:col-span-3 aspect-[16/10] sm:aspect-auto overflow-hidden [direction:ltr]">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-semibold text-ink-700">
            {project.category}
          </div>
        </div>

        {/* Content */}
        <div className="sm:col-span-2 p-5 lg:p-6 flex flex-col justify-center [direction:ltr]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={12} className="text-ink-400" />
            <span className="text-xs text-ink-400 font-medium">{project.year}</span>
          </div>
          <h3 className="font-display font-bold text-lg text-ink-900 mb-2 group-hover:text-accent-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-ink-500 leading-relaxed mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-ink-100 text-[10px] font-medium text-ink-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent-500 hover:gap-2 transition-all"
          >
            View Project <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
