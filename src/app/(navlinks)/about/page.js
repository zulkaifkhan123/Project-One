'use client'
import {
  Building,
  Globe,
  Package,
  Truck,
  Users,
  CheckCircle2,
  Store,
  ShoppingCart,
  Handshake,
  ArrowRight,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function AboutUs() {
  const router = useRouter();
  return (
    <div className="w-full bg-white text-gray-700">
      {/* Hero */}
      <section className="py-24 px-6 text-center border-b border-gray-200">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          About Us
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          Welcome to <span className="font-semibold">[Your Company Name]</span>, 
          a trusted distributor of branded products committed to delivering 
          <span className="text-gray-900 font-medium"> quality, authenticity,</span> 
          and <span className="text-gray-900 font-medium">value</span> to businesses worldwide.
        </p>
      </section>

      {/* Our Journey */}
      <section className="max-w-6xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-center border-b border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Journey</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We specialize in providing a wide selection of products sourced directly from reliable and verified suppliers, making us a dependable partner for retailers, e-commerce entrepreneurs, and wholesale buyers.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our journey began with a simple vision: to bridge the gap between 
            global brands and growing businesses. Over the years, we have built 
            strong supplier relationships, streamlined logistics, and created a 
            system that enables our partners to scale their operations with confidence.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you run a local retail store, build an e-commerce brand, or 
            expand on marketplaces like Amazon, eBay, or Shopify, we provide the 
            products, services, and support you need to succeed.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="rounded-2xl">
            <Image
              src="/aboutUs.webp"
              alt="Our Journey"
              width={400}
              height={300}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-gray-50 py-24 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            What We Do
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At [Your Company Name], we go beyond product distribution. We act as your long-term sourcing and operations partner.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: Package,
              title: "Branded Product Distribution",
              desc: "Offering a wide variety of products from well-known and trusted brands across multiple categories.",
            },
            {
              icon: Users,
              title: "Wholesale Supply",
              desc: "Providing bulk quantities at competitive wholesale prices, with a standard MOQ to ensure value for both sides.",
            },
            {
              icon: Globe,
              title: "Dropshipping Solutions",
              desc: "Allowing partners to sell selected products without holding inventory, with a minimum order of $100.",
            },
            {
              icon: Store,
              title: "Amazon & Marketplace Support",
              desc: "Supplying proper invoices that work on Amazon, assisting sellers in account verification and product approval.",
            },
            {
              icon: Truck,
              title: "Logistics & Fulfillment",
              desc: "Coordinating shipping both domestically and internationally, while ensuring products arrive safely and on time.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-10 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-gray-100 rounded-xl mb-6">
                <item.icon size={28} className="text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto border-b border-gray-200">
        <div className="bg-gray-100 p-10 rounded-2xl w-fit mx-auto mb-8">
          <Shield size={60} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment to Quality</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          Quality and trust are at the core of everything we do. Every product we distribute is sourced from official channels and undergoes careful quality checks before dispatch. We understand how critical authenticity is for business owners, especially those selling on global platforms, which is why we only deliver goods that meet the highest standards.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-center border-b border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose Us
          </h2>
          <ul className="space-y-5 text-gray-700">
            {[
              "Authentic Products – Direct sourcing from trusted and verified suppliers",
              "Amazon-Ready Invoices – Our invoices are accepted on Amazon for verification and approvals",
              "Global Shipping – Reliable domestic and international shipping solutions",
              "Scalability – Services tailored for small resellers, growing e-commerce entrepreneurs, and established wholesale businesses",
              "Customer Support – Dedicated assistance from inquiry to after-sales service",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <div className="bg-gray-100 p-10 rounded-2xl">
            <Globe size={80} className="text-gray-500" />
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="bg-gray-50 py-24 px-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Who We Work With
        </h2>
        <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">
          Our partners range from small retail stores to established wholesale businesses
        </p>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {[
            { name: "Retail Stores", desc: "Looking for bulk branded goods", icon: Store },
            { name: "E-commerce Entrepreneurs", desc: "Building private label or dropshipping businesses", icon: ShoppingCart },
            { name: "Amazon & eBay Sellers", desc: "Needing reliable suppliers with valid invoices", icon: Package },
            { name: "Wholesalers & Distributors", desc: "Scaling their product lines", icon: Handshake },
          ].map((partner, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto flex items-center justify-center bg-gray-100 rounded-xl mb-4">
                <partner.icon size={24} className="text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {partner.name}
              </h3>
              <p className="text-sm text-gray-600">{partner.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-10">
          Our mission is simple yet powerful: to empower businesses with access to 
          authentic products, seamless operations, and long-term growth opportunities. 
          We believe in partnerships built on trust, transparency, and success.
        </p>
        <button 
        onClick={() => router.push('/products')}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200">
          Get Started Today <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}