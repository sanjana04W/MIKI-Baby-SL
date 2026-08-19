"use client";

import React, { useState } from "react";
import { Phone, Mail, MessageCircle, Facebook, Send, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ScrollReveal } from "@/components/storefront/ScrollReveal";
import { addMessage } from "@/lib/adminMessages";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save message to localStorage — admin panel reads from same store
    addMessage({
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: subject.trim() || "General Inquiry",
      message: message.trim(),
      status: "unread",
      createdAt: new Date().toISOString(),
    });

    setSubmitted(true);

    setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full space-y-12">
        <ScrollReveal variant="fade-up">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Get in Touch with MIKI</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Have a question about wall art dimensions, custom birth plaques, or COD orders? We&apos;re here to help!
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal variant="slide-left" delay={150}>
              <div className="glass-card rounded-3xl p-6 space-y-6 border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Official Contact Channels
                </h2>

                <div className="space-y-4 text-xs">
                  <a
                    href="https://wa.me/94767568100"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">WhatsApp Direct Support</p>
                      <p className="text-[11px] font-semibold text-emerald-700">076 756 8100 (Click to Chat)</p>
                    </div>
                  </a>

                  <a
                    href="mailto:mikibabysl@gmail.com"
                    className="flex items-center gap-4 p-3 rounded-2xl bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors"
                  >
                    <Mail className="w-6 h-6 text-sky-600 shrink-0" />
                    <div>
                      <p className="font-bold">Email Support</p>
                      <p className="text-[11px] font-semibold text-sky-700">mikibabysl@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://www.facebook.com/share/1EB8C5CqVM/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-blue-600 shrink-0 fill-current" />
                    <div>
                      <p className="font-bold">Official Facebook Page</p>
                      <p className="text-[11px] font-semibold text-blue-700">@Miky baby Sl (10K Followers)</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200">
                    <Phone className="w-6 h-6 text-slate-500 shrink-0" />
                    <div>
                      <p className="font-bold">Call / SMS</p>
                      <p className="text-[11px] font-semibold text-slate-600">076 756 8100</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="slide-right" delay={250}>
              <div className="glass-card rounded-3xl p-8 space-y-6 border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="text-sm font-bold text-emerald-900">Message Sent Successfully!</h3>
                    <p className="text-xs text-emerald-700">
                      Thank you for reaching out to MIKI Baby SL. Our team will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Kasun Silva"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0771234567"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. yourname@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Subject *</label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Custom Wall Art Inquiry, Order Question..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Inquiry Details *</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you&apos;d like to ask about wall art, gifts, or custom orders..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-miki-pink text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-miki-pink hover:bg-miki-rose text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

