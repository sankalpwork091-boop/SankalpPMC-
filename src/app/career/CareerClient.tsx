'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export function CareerClient() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Legal Associate — Redevelopment',
    experience: '',
    message: '',
    website_hp: '',
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const openPositions = [
    {
      title: 'Legal Associate — Redevelopment',
      experience: '2–5 Years',
      location: 'CBD Belapur / Sanpada',
      type: 'Full-time',
      desc: 'Hands-on experience in Section 79A processes, drafting development agreements, and title searches.',
    },
    {
      title: 'Senior Civil Site Engineer (PMC)',
      experience: '4–8 Years',
      location: 'Navi Mumbai Sites',
      type: 'Full-time',
      desc: 'Quality control, bar bending schedules, material audits, and contractor milestone verification.',
    },
    {
      title: 'Project Architect',
      experience: '3–6 Years',
      location: 'CBD Belapur Head Office',
      type: 'Full-time',
      desc: 'Proficient in AutoCad, Revit, FSI/TDR calculations, and housing society conceptual master planning.',
    },
    {
      title: 'Liaisoning Executive',
      experience: '2–4 Years',
      location: 'Navi Mumbai & MMR',
      type: 'Full-time',
      desc: 'Liaisoning with NMMC, CIDCO, tree authority, and fire department for statutory approvals.',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError('');

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File exceeds 5MB limit. Please upload a smaller file.');
        setCvFile(null);
        e.target.value = '';
        return;
      }
      setCvFile(file);
    } else {
      setCvFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('email', formState.email);
      formData.append('phone', formState.phone);
      formData.append('role', formState.role);
      formData.append('experience', formState.experience);
      formData.append('message', formState.message);
      formData.append('website_hp', formState.website_hp);

      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const res = await fetch('/api/career', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setFormState({
          name: '',
          email: '',
          phone: '',
          role: 'Legal Associate — Redevelopment',
          experience: '',
          message: '',
          website_hp: '',
        });
        setCvFile(null);
      } else {
        setStatus('error');
        setErrorMessage(
          result.error ||
            'Unable to submit application. Please email your CV directly to careers@sankalppmc.com.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Network error. Please email your CV directly to careers@sankalppmc.com.'
      );
    }
  };

  return (
    <div className="relative pt-24 pb-20 bg-white text-[#1B1B1F]">
      {/* ─── Hero Header (Warm Ivory) ─── */}
      <section className="px-6 py-20 md:py-28 text-center bg-[#FAF7F0] border-b border-[#E9E2D0]">
        <div className="max-w-4xl mx-auto">
          <span className="section-eyebrow mb-3">
            Join Our Mission
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B1B1F] mb-6">
            Build Trust Where It <span className="italic text-[#B8913A]">Matters Most</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5B5B63] leading-relaxed">
            At Sankalp PMC, we don’t just engineer buildings; we safeguard families, legal rights, and urban futures. Join our multi-disciplinary team.
          </p>
        </div>
      </section>

      {/* ─── Open Roles (White) ─── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-eyebrow mb-2">
            Career Opportunities
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F] mb-2">
            Current Openings
          </h2>
          <p className="text-sm text-[#5B5B63]">
            We are looking for dedicated legal, engineering, and architectural professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {openPositions.map((pos, idx) => (
            <GlassCard key={idx} variant="default" className="flex flex-col p-6 md:p-8 bg-white h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#8F6B1E] bg-[#F6EFDD] px-3 py-1 rounded-full border border-[#D4AF5A]/30">
                  {pos.type} • {pos.location}
                </span>
                <span className="text-xs text-[#5B5B63] font-medium">{pos.experience}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1B1B1F] mb-2">
                {pos.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5B5B63] leading-relaxed flex-1 mb-5">
                {pos.desc}
              </p>
              <button
                onClick={() => {
                  setFormState((prev) => ({ ...prev, role: pos.title }));
                  document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#8F6B1E] hover:text-[#B8913A] flex items-center gap-1 self-start transition-colors"
              >
                Apply for this position →
              </button>
            </GlassCard>
          ))}
        </div>

        {/* ─── Application Form (Warm Ivory Wrapper) ─── */}
        <div id="apply-form" className="max-w-2xl mx-auto pt-6">
          <GlassCard variant="default" className="p-8 md:p-10 bg-white border border-[#E9E2D0]">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1B1B1F] mb-2 text-center">
              Submit Your Candidacy
            </h3>
            <p className="text-xs text-[#5B5B63] text-center mb-8">
              Or send your CV directly to <a href="mailto:careers@sankalppmc.com" className="text-[#8F6B1E] underline font-medium">careers@sankalppmc.com</a>
            </p>

            {status === 'success' ? (
              <div className="p-8 text-center bg-[#FAF7F0] rounded-xl border border-[#D4AF5A]/40">
                <span className="text-4xl mb-3 block text-[#8F6B1E]">✓</span>
                <h4 className="font-heading text-lg font-bold text-[#1B1B1F] mb-2">
                  Application Submitted
                </h4>
                <p className="text-xs text-[#5B5B63] leading-relaxed">
                  Thank you for your interest in joining Sankalp PMC. Our HR team will review your qualifications and reach out if your profile matches an opening.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B1F] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E9E2D0] text-[#1B1B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B1B1F] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E9E2D0] text-[#1B1B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B1B1F] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E9E2D0] text-[#1B1B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B1B1F] mb-1.5">
                      Position of Interest *
                    </label>
                    <select
                      value={formState.role}
                      onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E9E2D0] text-[#1B1B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
                    >
                      {openPositions.map((p) => (
                        <option key={p.title} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B1B1F] mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Years"
                      value={formState.experience}
                      onChange={(e) => setFormState({ ...formState, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E9E2D0] text-[#1B1B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B1B1F] mb-1.5">
                    Brief Summary / Portfolio Link
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your background or include a link to your resume/portfolio..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E9E2D0] text-[#1B1B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
                  />
                </div>

                {/* CV File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B1B1F] mb-1.5">
                    Upload Resume / CV (PDF, DOC, DOCX • Max 5MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full text-xs text-[#5B5B63] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#F6EFDD] file:text-[#8F6B1E] hover:file:bg-[#E9E2D0] cursor-pointer rounded-lg bg-white border border-[#E9E2D0] p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
                    />
                  </div>
                  {cvFile && (
                    <p className="text-[11px] text-green-700 mt-1 font-medium">
                      ✓ Selected: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  {fileError && (
                    <p className="text-[11px] text-red-600 mt-1">
                      ⚠️ {fileError}
                    </p>
                  )}
                </div>

                {/* Honeypot field for bot suppression */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="career_website_hp">Leave this field blank</label>
                  <input
                    id="career_website_hp"
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
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-700 leading-relaxed">
                    ⚠️ {errorMessage || 'Unable to submit application. Please email your CV directly to careers@sankalppmc.com.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full text-center justify-center !py-3 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1B1B1F]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting Application...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
