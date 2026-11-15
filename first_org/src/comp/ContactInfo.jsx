import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactInfo() {
  const contactItems = [
    {
      icon: Mail,
      label: "Email engineering",
      value: "info@gammasolutions.com",
      href: "mailto:info@gammasolutions.com",
      detail: "Direct response within 24 business hours",
    },
    {
      icon: Phone,
      label: "Direct telephone",
      value: "+251 11 654 3210",
      href: "tel:+251116543210",
      detail: "Monday – Friday, 8:00 AM – 6:00 PM EAT",
    },
    {
      icon: MapPin,
      label: "Headquarters & plant",
      value: "Bole Sub-City, Industrial Zone",
      detail: "Addis Ababa, Ethiopia",
    },
    {
      icon: Clock,
      label: "Emergency support",
      value: "24/7 Field dispatch",
      detail: "Available for active substation contracts",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {contactItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
          >
            <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
              <Icon className="w-4 h-4" />
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:underline block mt-0.5"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {item.value}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {item.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
