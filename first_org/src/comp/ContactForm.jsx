import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6 sm:p-10">
      {submitted ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium text-foreground tracking-tight">
            Message received
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Thank you for contacting Gamma Solutions. An electrical engineer will review your inquiry and follow up shortly.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 text-xs font-medium text-foreground border border-border rounded-xl hover:bg-muted transition-colors"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground">
              Send us an inquiry
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Please share your project specifications or equipment requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-medium text-foreground block">
                Full name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Abebe Kebede"
                className="w-full rounded-lg border border-border bg-muted/40 py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-medium text-foreground block">
                Work email address
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="eng.abebe@company.com"
                className="w-full rounded-lg border border-border bg-muted/40 py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-xs font-medium text-foreground block">
                Phone number
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+251 91 123 4567"
                className="w-full rounded-lg border border-border bg-muted/40 py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card transition-colors"
              />
            </div>

            {/* Company / Organization */}
            <div className="space-y-1.5">
              <label htmlFor="contact-company" className="text-xs font-medium text-foreground block">
                Enterprise / Plant name
              </label>
              <input
                id="contact-company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. National Grid / Cement Works"
                className="w-full rounded-lg border border-border bg-muted/40 py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card transition-colors"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-xs font-medium text-foreground block">
              Inquiry details & technical scope
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your power rating, required voltage levels, delivery timelines, or site service needs..."
              className="w-full rounded-lg border border-border bg-muted/40 py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-foreground focus:bg-card transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              <span>Submit message</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
