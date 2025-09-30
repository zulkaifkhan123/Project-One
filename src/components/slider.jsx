"use client";

import { Truck, PhoneCall, DollarSign, Gift } from "lucide-react";

export default function MovingInfoCards() {
  const cards = [
    {
      icon: <Truck className="w-8 h-8 text-red-400" />,
      title: "Worldwide Shipping",
      desc: "Fast and reliable delivery across the globe.",
    },
    {
      icon: <PhoneCall className="w-8 h-8 text-blue-400" />,
      title: "24/7 Online Support",
      desc: "We’re here to help anytime, anywhere.",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-400" />,
      title: "Money Guarantee",
      desc: "Get a refund if you're not satisfied.",
    },
    {
      icon: <Gift className="w-8 h-8 text-yellow-400" />,
      title: "Win $100 Voucher",
      desc: "Exclusive rewards and discounts await you.",
    },
  ];

  return (
    <section className="w-full py-12 overflow-hidden">
      <div className="relative flex w-full overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...cards, ...cards].map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 mx-4 bg-white rounded-2xl  p-6 text-center hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind custom animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </section>
  );
}
