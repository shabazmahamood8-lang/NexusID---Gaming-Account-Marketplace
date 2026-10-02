import React, { useState } from 'react';
import { useToast } from '../context/ToastContext.tsx';
import { api } from '../services/api.ts';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, MessageCircle } from 'lucide-react';

interface ContactPageProps {
  settings?: any;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      error('Please complete all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.sendContactMessage({
        name,
        email,
        phone,
        subject,
        message,
      });

      if (res.success) {
        success('Your message has been sent to our support desk!');
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        error(res.message || 'Failed to send message');
      }
    } catch (err: any) {
      error(err.message || 'Error sending message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNum = settings?.whatsappNumber || '+880 1700-000000';
  const supportEmail = settings?.supportEmail || 'support@nexusid.store';
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/nexusid';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">24/7 Gamer Support Desk</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Contact NexusID</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Have questions about an account listing, need help with payment, or want to verify an ID transfer? We are here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-white">Send Us a Direct Message</h2>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Message Received!</h3>
              <p className="text-xs text-slate-300">
                Our support agents have received your inquiry and will respond via email or WhatsApp shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahim Ahmed"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1711223344"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Account inquiry / Payment issue"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or order question in detail..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    Submit Message
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Channels Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Instant Contact Channels
            </h3>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center gap-3.5 transition-colors group block"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">WhatsApp Live Chat</span>
                <span className="text-[11px] text-emerald-400 font-mono">{whatsappNum}</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Fastest response for order verification (avg 5 mins)</p>
              </div>
            </a>

            {/* Support Email */}
            <a
              href={`mailto:${supportEmail}`}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center gap-3.5 transition-colors group block"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Official Support Email</span>
                <span className="text-[11px] text-cyan-300 font-mono">{supportEmail}</span>
                <p className="text-[10px] text-slate-500 mt-0.5">For formal disputes & partnership requests</p>
              </div>
            </a>

            {/* Facebook Community */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center gap-3.5 transition-colors group block"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Facebook Official Page</span>
                <span className="text-[11px] text-blue-300 font-mono">facebook.com/nexusid</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Community announcements & customer shoutouts</p>
              </div>
            </a>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-400 space-y-1">
            <span className="text-slate-300 font-semibold block">Operating Hours:</span>
            <p>Support team operates 24/7/365 with on-duty verification agents.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
