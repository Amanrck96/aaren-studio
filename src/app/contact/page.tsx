"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">GET IN TOUCH</h4>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-16">
          CONTACT US<span className="text-accent">.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Details & Mocks */}
          <div className="space-y-12">
            <p className="text-neutral-400 text-lg leading-relaxed font-light">
              Ready to construct something unreal? Fill out the project form, or reach out to our primary creative office directly.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-950 border border-neutral-900 flex items-center justify-center text-accent">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Email Address</h4>
                  <p className="text-sm font-semibold uppercase">info@aaren.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-950 border border-neutral-900 flex items-center justify-center text-accent">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Phone</h4>
                  <p className="text-sm font-semibold uppercase">+91-9876543210</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-950 border border-neutral-900 flex items-center justify-center text-accent">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500">Creative Office</h4>
                  <p className="text-sm font-semibold uppercase">Bangalore, Karnataka, India</p>
                </div>
              </div>
            </div>

            {/* Premium Custom Map Mock */}
            <div className="w-full aspect-video bg-neutral-950 border border-neutral-900 relative overflow-hidden flex flex-col justify-end p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              {/* Abstract Map visual elements */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff3e3e_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-20">
                <h4 className="text-xs font-bold uppercase text-accent tracking-widest">MAP NAVIGATION ROUTE</h4>
                <p className="text-sm font-bold mt-1 uppercase">Aaren Studio, Tech Park Road, Bangalore</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="border border-neutral-900 bg-neutral-950 p-10">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">PROJECT DEBRIEF</h2>
            
            {sent ? (
              <div className="p-6 bg-accent/20 border border-accent text-center">
                <h3 className="text-xl font-bold uppercase">Message Received</h3>
                <p className="text-neutral-400 text-sm mt-2">Thank you! A creative director will verify your details and respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
