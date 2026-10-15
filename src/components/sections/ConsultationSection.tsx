'use client';

import { useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { GlassCard } from '@/components/ui/GlassCard';

export function ConsultationSection() {
  const [formState, setFormState] = useState({
    societyName: '',
    location: '',
    members: '',
    contactName: '',
    role: 'Managing Committee Member',
    phone: '',
    email: '',
    message: '',
    website_hp: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setFormState({
          societyName: '',
          location: '',
          members: '',
          contactName: '',
          role: 'Managing Committee Member',
          phone: '',
          email: '',
          message: '',
          website_hp: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(
          result.error ||
            `Unable to submit at this moment. Please call us directly at ${siteConfig.phones[0]}.`
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        `Unable to reach the server. Please call us directly at ${siteConfig.phones[0]}.`
      );
    }
  };

  return (
    <section
      data-section="17"
      id="consultation"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 z-10"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Direct Contact & Assurances */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 inline-block">
            Take The First Step
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light mb-6">
            Consult With Our Advocate-Led Team
          </h2>
          <p className="text-base text-text-muted leading-relaxed mb-8">
            Whether your society is considering redevelopment for the first time or seeking clarity on 79A guidelines, we offer transparent, ethical guidance.
          </p>

          {/* Quick Call Cards */}
          <div className="flex flex-col gap-4 mb-8">
            <a
              href={`tel:${siteConfig.phones[0].replace(/\s/g, '')}`}
              className="p-4 rounded-xl bg-navy-light/60 border border-white/10 hover:border-gold/40 flex items-center gap-4 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                📞
              </div>
              <div>
                <p className="text-xs text-text-muted">Direct Advisory Line</p>
                <p className="text-sm font-bold text-text-light">{siteConfig.phones[0]}</p>
              </div>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="p-4 rounded-xl bg-navy-light/60 border border-white/10 hover:border-gold/40 flex items-center gap-4 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                ✉️
              </div>
              <div>
                <p className="text-xs text-text-muted">Email Inquiry</p>
                <p className="text-sm font-bold text-text-light">{siteConfig.email}</p>
              </div>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-gold/5 border border-gold/15">
            <p className="text-xs text-gold-soft leading-relaxed">
              🔒 <strong className="text-gold">100% Confidential:</strong> We never share society records or contact details. All initial feasibility evaluations are protected under professional privilege.
            </p>
          </div>
        </div>

        {/* Right Column: Lead Form */}
        <div className="lg:col-span-7">
          <GlassCard variant="gold" className="p-8 md:p-10 border-gold/30">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-light mb-2">
              Request Society Committee Consultation
            </h3>
            <p className="text-xs text-text-muted mb-6">
              Fill in your details below and our team will get in touch to schedule an in-person or presentation meeting.
            </p>

            {status === 'success' ? (
              <div className="p-8 text-center bg-navy/80 rounded-xl border border-gold/40">
                <span className="text-4xl mb-3 block">✓</span>
                <h4 className="font-heading text-lg font-bold text-gold mb-2">
                  Consultation Request Received
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Thank you for reaching out. A senior redevelopment consultant from Sankalp PMC will contact you within 24 business hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs text-gold underline underline-offset-4"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1.5">
                      Society Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sagar Sagar CHS Ltd."
                      value={formState.societyName}
                      onChange={(e) =>
                        setFormState({ ...formState, societyName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy/80 border border-white/10 text-text-light placeholder:text-text-muted/50 text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1.5">
                      Location / Node *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Nerul, Vashi, Belapur"
                      value={formState.location}
                      onChange={(e) =>
                        setFormState({ ...formState, location: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy/80 border border-white/10 text-text-light placeholder:text-text-muted/50 text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1.5">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      value={formState.contactName}
                      onChange={(e) =>
                        setFormState({ ...formState, contactName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy/80 border border-white/10 text-text-light placeholder:text-text-muted/50 text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1.5">
                      Your Role in Society
                    </label>
                    <select
                      value={formState.role}
                      onChange={(e) =>
                        setFormState({ ...formState, role: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy/80 border border-white/10 text-text-light text-sm focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="Chairman">Chairman</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                      <option value="Managing Committee Member">Managing Committee Member</option>
                      <option value="Society Member">Society Member / Resident</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy/80 border border-white/10 text-text-light placeholder:text-text-muted/50 text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-light mb-1.5">
                      Number of Flats / Members
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 24"
                      value={formState.members}
                      onChange={(e) =>
                        setFormState({ ...formState, members: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy/80 border border-white/10 text-text-light placeholder:text-text-muted/50 text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-light mb-1.5">
                    Specific Inquiries or Society Status
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your building age, any past resolutions, or current questions..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy/80 border border-white/10 text-text-light placeholder:text-text-muted/50 text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {/* Honeypot field for bot suppression */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave this field blank</label>
                  <input
                    id="website_hp"
                    type="text"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formState.website_hp}
                    onChange={(e) =>
                      setFormState({ ...formState, website_hp: e.target.value })
                    }
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 leading-relaxed">
                    ⚠️ {errorMessage || `Unable to submit at this moment. Please call us directly at ${siteConfig.phones[0]}.`}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full text-center justify-center !py-3 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-navy" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Transmitting to Legal Team...
                    </span>
                  ) : (
                    'Submit Consultation Request'
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
