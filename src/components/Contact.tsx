import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { services } from '@/data';

const recipientEmail = 'fizawebstudio@gmail.com';

const contactInfo = [
  { icon: Mail, label: 'Email', value: recipientEmail, href: `mailto:${recipientEmail}` },
  { icon: Phone, label: 'Availability', value: '0312 7195206', href: 'tel:03127195206' },
  { icon: MapPin, label: 'Location', value: 'Pakistan, Lahore - Remote', href: '#' },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', services: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { ref, visible } = useScrollReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

      if (!supabaseUrl || !supabaseAnonKey) {
        const fallbackSubject = encodeURIComponent(`Website inquiry from ${form.name || 'New Contact'}`);
        const fallbackBody = encodeURIComponent(
          [
            `Name: ${form.name}`,
            `Email: ${form.email}`,
            `Phone: ${form.phone || 'Not provided'}`,
            `Services Interested In: ${form.services || 'Not specified'}`,
            '',
            'Message:',
            form.message,
          ].join('\n')
        );

        window.location.href = `mailto:${recipientEmail}?subject=${fallbackSubject}&body=${fallbackBody}`;
        setStatus('sent');
        setForm({ name: '', email: '', phone: '', services: '', message: '' });
        return;
      }

      const apiUrl = `${supabaseUrl}/functions/v1/send-contact-email`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send message. Please try again.');
      }

      setStatus('sent');
      setForm({ name: '', email: '', phone: '', services: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-ink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Get In Touch"
          title={<>Let's build something <span className="text-accent-500">great together</span></>}
          description="Tell me about your business, website or project. Share what you need, what you want to improve and what you want your website to achieve."
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mt-14">
          {/* Left: Info */}
          <div ref={ref} className={`lg:col-span-5 space-y-5 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
            <div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-2">
                Tell me about your project
              </h3>
              <p className="text-ink-500 leading-relaxed text-sm">
                Whether you need a new WordPress website, Shopify store, landing page or improvements to an existing website, I can help you plan the right solution.
              </p>
            </div>

            <div className="space-y-2.5">
              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.href}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-ink-100 hover:border-accent-500/30 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 group-hover:bg-accent-500 flex items-center justify-center transition-colors">
                    <info.icon size={18} className="text-accent-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-400 font-medium uppercase tracking-wide">{info.label}</div>
                    <div className="text-sm font-semibold text-ink-900">{info.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className={`lg:col-span-7 ${visible ? 'animate-fade-up animation-delay-200' : 'opacity-0'}`}>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-ink-100 shadow-sm space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  label="Phone Number"
                  type="tel"
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-2 uppercase tracking-wide">
                    Services Interested In
                  </label>
                  <div className="relative">
                    <select
                      value={form.services}
                      onChange={(e) => setForm({ ...form, services: e.target.value })}
                      className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-ink-50 border border-ink-100 text-ink-900 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all cursor-pointer"
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-2 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your business, website goals, required pages, features or anything you would like to improve."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink-50 border border-ink-100 text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent-500 text-white font-semibold text-sm hover:bg-accent-600 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'idle' && (
                  <>Start My Project <Send size={16} /></>
                )}
                {status === 'sending' && (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                )}
                {status === 'sent' && (
                  <><CheckCircle2 size={16} /> Message Sent!</>
                )}
                {status === 'error' && (
                  <><AlertCircle size={16} /> Failed — Try Again</>
                )}
              </button>

              {status === 'sent' && (
                <p className="text-center text-sm text-green-600 font-medium animate-fade-in">
                  Thanks! I'll get back to you within 24 hours.
                </p>
              )}
              {status === 'error' && (
                <p className="text-center text-sm text-red-500 font-medium animate-fade-in">
                  {errorMessage || 'Something went wrong. Please try again or email me directly.'}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-700 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-ink-50 border border-ink-100 text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 transition-all"
      />
    </div>
  );
}
