"use client";
import { Mail, Phone, MapPin, Globe, Clock } from "lucide-react";

export default function ContactUs() {
  return (
    <section className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl p-10">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          At <span className="font-semibold">YourCompany</span>, we’re always
          here to help. Whether you’re looking for support, want to learn more
          about our services, or just want to say hello — our team is only a
          message away.
        </p>

        {/* Main Contact Info */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* General Inquiries */}
            <div className="flex items-start space-x-4">
              <Mail className="w-7 h-7 text-blue-600" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  General Inquiries
                </h2>
                <p className="text-gray-600">info@yourcompany.com</p>
              </div>
            </div>

            {/* Customer Support */}
            <div className="flex items-start space-x-4">
              <Mail className="w-7 h-7 text-green-600" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  Customer Support
                </h2>
                <p className="text-gray-600">support@yourcompany.com</p>
                <p className="text-gray-500 text-sm">
                  Response within 24–48 hours
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <Phone className="w-7 h-7 text-purple-600" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">Phone</h2>
                <p className="text-gray-600">+1 (123) 456-7890</p>
                <p className="text-gray-600">+1 (987) 654-3210</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-4">
              <Clock className="w-7 h-7 text-orange-600" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  Working Hours
                </h2>
                <p className="text-gray-600">Monday – Friday: 9:00 AM – 6:00 PM</p>
                <p className="text-gray-600">Saturday: 10:00 AM – 4:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="w-7 h-7 text-red-600" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  Headquarters
                </h2>
                <p className="text-gray-600">
                  123 Business Street,
                  <br />
                  Tech City, USA 45678
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-7 h-7 text-teal-600" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  Branch Office
                </h2>
                <p className="text-gray-600">
                  45 Innovation Avenue,
                  <br />
                  Silicon Valley, USA 12345
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Globe className="w-7 h-7 text-indigo-600" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900">
                  Website
                </h2>
                <p className="text-gray-600">www.yourcompany.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 border-t pt-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Connect With Us
          </h2>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-600 font-medium"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-pink-600 hover:text-pink-800 font-medium"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-blue-800 hover:text-blue-900 font-medium"
            >
              Facebook
            </a>
          </div>
        </div>

        
        <div className="mt-10 text-center text-gray-500 text-sm">
          Our team strives to reply promptly. For urgent matters, please use the
          phone numbers provided above.
        </div>
      </div>
    </section>
  );
}
