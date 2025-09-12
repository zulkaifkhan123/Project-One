"use client";

import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-50 min-h-screen px-6 md:px-16 lg:px-32 py-12">
      {/* Page Heading */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 text-lg">
          Please read these terms and conditions carefully before using our website or services.
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
        <p className="text-gray-700 text-base leading-relaxed">
          These Terms and Conditions govern your use of our website and services. By accessing or using
          our website, you agree to be bound by these terms. If you do not agree with any part of
          these terms, please do not use our services.
        </p>
      </section>

      {/* User Obligations */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Obligations</h2>
        <p className="text-gray-700 mb-2">
          As a user of our website, you agree to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Provide accurate and truthful information during registration or transactions.</li>
          <li>Maintain the confidentiality of your account credentials.</li>
          <li>Use the website and services only for lawful purposes.</li>
          <li>Not engage in any activities that may harm the website or other users.</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
        <p className="text-gray-700">
          All content on this website, including text, images, graphics, logos, and software,
          is the property of the company or its licensors and is protected by copyright, trademark,
          and other intellectual property laws. You may not copy, reproduce, or distribute any
          content without prior written permission.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
        <p className="text-gray-700">
          The company is not liable for any direct, indirect, incidental, or consequential damages
          arising from your use of the website or services. This includes any errors, omissions,
          or interruptions in service. Use the website at your own risk.
        </p>
      </section>

      {/* Privacy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy</h2>
        <p className="text-gray-700">
          We respect your privacy. Any personal information collected will be used in accordance
          with our Privacy Policy. By using our website, you consent to the collection and use
          of your information as described.
        </p>
      </section>

      {/* Termination */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
        <p className="text-gray-700">
          We reserve the right to suspend or terminate your access to the website or services
          at any time, without notice, if we believe you have violated these Terms and Conditions
          or any applicable laws.
        </p>
      </section>

      {/* Governing Law */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
        <p className="text-gray-700">
          These Terms and Conditions are governed by and construed in accordance with the laws
          of [Your Country/State]. Any disputes arising under or in connection with these terms
          shall be subject to the exclusive jurisdiction of the courts located in [Your Location].
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
        <p className="text-gray-700">
          We may update these Terms and Conditions from time to time. Any changes will be posted
          on this page with an updated revision date. It is your responsibility to review the
          terms regularly. Continued use of the website constitutes acceptance of the updated terms.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms and Conditions, please contact us at:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Email: <span className="text-blue-600 underline">support@example.com</span></li>
          <li>Phone: +123 456 7890</li>
          <li>Address: 123 Business Street, City, Country</li>
        </ul>
      </section>
    </div>
  );
}
