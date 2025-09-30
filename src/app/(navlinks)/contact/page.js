"use client";
import { Mail, Phone, MapPin, Globe, Clock } from "lucide-react";

export default function ContactUs() {
  return (
    <section className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          At <span className="font-semibold">YourCompany</span>, we’re always here to help.  
          Whether you’re looking for support, want to learn more about our services,  
          or just want to say hello — our team is only a message away.
        </p>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
          {/* Left Side */}
          <div className="space-y-6 sm:space-y-8">
            
            <ContactItem
              icon={<Mail className="w-7 h-7 text-blue-600" />}
              title="General Inquiries"
              desc="info@yourcompany.com"
              link="mailto:info@yourcompany.com"
            />

            <ContactItem
              icon={<Mail className="w-7 h-7 text-green-600" />}
              title="Customer Support"
              desc="support@yourcompany.com"
              sub="Response within 24–48 hours"
              link="mailto:support@yourcompany.com"
            />

            <ContactItem
              icon={<Phone className="w-7 h-7 text-purple-600" />}
              title="Phone"
              desc="+1 (123) 456-7890"
              sub="+1 (987) 654-3210"
              link="tel:+11234567890"
            />

            <ContactItem
              icon={<Clock className="w-7 h-7 text-orange-600" />}
              title="Working Hours"
              desc="Mon – Fri: 9:00 AM – 6:00 PM"
              sub="Sat: 10:00 AM – 4:00 PM | Sun: Closed"
            />
          </div>

          {/* Right Side */}
          <div className="space-y-6 sm:space-y-8">
            <ContactItem
              icon={<MapPin className="w-7 h-7 text-red-600" />}
              title="Headquarters"
              desc="123 Business Street, Tech City, USA 45678"
            />

            <ContactItem
              icon={<MapPin className="w-7 h-7 text-teal-600" />}
              title="Branch Office"
              desc="45 Innovation Avenue, Silicon Valley, USA 12345"
            />

            <ContactItem
              icon={<Globe className="w-7 h-7 text-indigo-600" />}
              title="Website"
              desc="www.yourcompany.com"
              link="https://www.yourcompany.com"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 border-t pt-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Connect With Us
          </h2>
          <div className="flex justify-center flex-wrap gap-4">
            {[
              { name: "LinkedIn", color: "text-blue-600 hover:text-blue-800" },
              { name: "Twitter", color: "text-sky-500 hover:text-sky-700" },
              { name: "Instagram", color: "text-pink-600 hover:text-pink-800" },
              { name: "Facebook", color: "text-blue-800 hover:text-blue-900" },
            ].map((s, i) => (
              <a
                key={i}
                href="#"
                className={`${s.color} font-medium transition`}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          Our team strives to reply promptly.  
          For urgent matters, please use the phone numbers provided above.
        </div>
      </div>
    </section>
  );
}

// Reusable Contact Item Component
function ContactItem({ icon, title, desc, sub, link }) {
  return (
    <div className="flex items-start space-x-4">
      {icon}
      <div>
        <h2 className="font-semibold text-lg text-gray-900">{title}</h2>
        {link ? (
          <a
            href={link}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            {desc}
          </a>
        ) : (
          <p className="text-gray-600">{desc}</p>
        )}
        {sub && <p className="text-gray-500 text-sm">{sub}</p>}
      </div>
    </div>
  );
}
