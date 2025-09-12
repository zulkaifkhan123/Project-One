"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Shield,
  DollarSign,
  Globe,
  CreditCard,
  Truck,
  CheckCircle2,
  Headphones,
  UserPlus,
  ArrowRight,
} from "lucide-react";

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

const faqs = [
  {
    icon: Package,
    question: "What types of branded products do you distribute?",
    answer:
      "We distribute a wide range of branded products across multiple categories, including electronics, home and kitchen, beauty and personal care, and fashion accessories. Our catalog is regularly updated with in-demand items.",
  },
  {
    icon: Shield,
    question: "Are your products authentic?",
    answer:
      "Yes. All our products are sourced from trusted suppliers and official channels to ensure authenticity and quality.",
  },
  {
    icon: DollarSign,
    question: "Do you have a Minimum Order Quantity (MOQ)?",
    answer:
      "Yes. Our standard MOQ is $1,000 per order, though it may vary depending on the brand and product category.",
  },
  {
    icon: Globe,
    question: "Do you ship internationally?",
    answer:
      "Yes. We offer both domestic and international shipping, subject to brand policies and regional regulations.",
  },
  {
    icon: CreditCard,
    question: "What payment methods do you accept?",
    answer:
      "We accept secure payment methods including PayPal (on selected orders) and major credit cards.",
  },
  {
    icon: Truck,
    question: "Do you offer dropshipping services?",
    answer:
      "Yes. For selected products and brands, we provide dropshipping solutions, with a minimum order value of $100. This allows you to sell directly without holding inventory.",
  },
  {
    icon: CheckCircle2,
    question: "How do you ensure product quality?",
    answer:
      "All items go through quality checks before dispatch. Additionally, we work only with verified suppliers to maintain consistent product standards.",
  },
  {
    icon: Headphones,
    question: "Do you provide after-sales support?",
    answer:
      "Yes. We provide customer support for all order-related inquiries and assist with replacements or issues where applicable.",
  },
  {
    icon: UserPlus,
    question: "How can I start working with you?",
    answer:
      "You can get started by reaching out with your business details, such as company name, tax ID, and order requirements. Once approved, we will share our product catalog, pricing, and order process.",
  },
  // ✅ New Questions
  {
    icon: DollarSign,
    question: "Do you provide bulk discounts?",
    answer:
      "Yes. We offer attractive discounts for bulk and repeat orders. Pricing improves as order quantities increase.",
  },
  {
    icon: Globe,
    question: "Can I sell your products on Amazon or other marketplaces?",
    answer:
      "Yes. Many of our products are suitable for sale on Amazon, eBay, Shopify, and other marketplaces. However, please note that some brands are restricted and may not be permitted on certain third-party platforms.",
  },
  {
    icon: CheckCircle2,
    question: "Do your invoices work on Amazon?",
    answer:
      "Yes. We provide proper invoices with every order, and our invoices are accepted by Amazon for account verification and product approval purposes. This makes it easier for sellers to list and scale products on the platform.",
  },
  {
    icon: Shield,
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy only if the product arrives damaged or defective. Customers must notify us within 7 days of receiving the order, along with proof of damage. Once the returned item is inspected and approved, a replacement or refund will be processed. Please note that refunds or returns are not offered in any other situation.",
  },
];


  return (
    <div className="w-full bg-white text-gray-800">
      {/* Hero */}
      <section className="py-20 px-6 text-center border-b border-gray-200">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          Find answers to the most common questions about our products,
          services, and partnership process. Can’t find what you’re looking
          for?
          <span className="text-gray-900 font-medium"> Contact us directly.</span>
        </p>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border hover:cursor-pointer border-gray-200 rounded-2xl shadow-sm hover:shadow-md  transition-shadow duration-300"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-2xl"
              >
                <div className="flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-8 flex items-center justify-center bg-gray-100 rounded-xl">
                    <faq.icon size={20} className="text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <div>
                  {openFAQ === index ? (
                    <ChevronUp size={24} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={24} className="text-gray-500" />
                  )}
                </div>
              </button>

              {/* Answer with animation */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-6 border-t border-gray-100">
                  <div className="pt-6 pl-16">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-20 px-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-12">
            Our team is here to help you get started. Reach out with your
            specific requirements and we’ll provide personalized assistance for
            your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200">
              Contact Our Team <ArrowRight size={18} />
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
              Request Catalog <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$1,000</div>
            <div className="text-sm text-gray-600 font-medium">Standard MOQ</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$100</div>
            <div className="text-sm text-gray-600 font-medium">
              Dropshipping Min
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">Global</div>
            <div className="text-sm text-gray-600 font-medium">
              Shipping Available
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
            <div className="text-sm text-gray-600 font-medium">
              Authentic Products
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
