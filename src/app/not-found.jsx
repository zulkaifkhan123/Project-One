'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  MapPin, 
  Clock,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';

export default function NotFoundPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const popularPages = [
    { name: 'Products', href: '/products', icon: '📦' },
    { name: 'Brands', href: '/brands', icon: '🏷️' },
    { name: 'About Us', href: '/about', icon: '👥' },
    { name: 'Contact', href: '/contact', icon: '📞' },
    { name: 'Terms and Conditions', href: '/terms', icon: '📝' },
    { name: 'FAQ', href: '/faq', icon: '❓' }
  ];

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="relative w-full">
        {/* Main Content Card */}
        <div className="bg-white rounded-none overflow-hidden">
          
          {/* Header Section (removed black background) */}
          <div className="px-8 py-6 text-black border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-sm font-medium text-gray-600">Navigation Error</h1>
                  <p className="text-2xl font-bold">Page Not Found</p>
                </div>
              </div>
              
              {/* Auto-redirect counter */}
              <div className="text-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Auto redirect in</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {countdown}s
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* 404 Visual */}
            <div className="text-center mb-12">
              <div className="inline-block relative">
                <div className="text-8xl md:text-9xl font-black text-gray-200 select-none">
                  404
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="p-6 bg-gray-200 rounded-full text-gray-700 shadow-lg">
                    <Search className="w-12 h-12" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for seems to have wandered off into the digital wilderness. 
                Don't worry though – we'll help you find your way back to where you need to be.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/"
                className="group flex items-center space-x-1 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-100 min-w-[200px] justify-center"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              
              <button
                onClick={handleGoBack}
                className="group flex cursor-pointer items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-100 min-w-[200px] justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Popular Pages */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {popularPages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    className="group p-4 bg-white border border-gray-200 hover:border-gray-400 rounded-xl hover:shadow-md hover:scale-100 text-center"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {page.icon}
                    </div>
                    <div className="font-medium text-gray-700 group-hover:text-black">
                      {page.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Still Can't Find What You're Looking For?
                </h3>
                <p className="text-gray-600">
                  Our support team is here to help you navigate and find exactly what you need.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="group flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 hover:border-black rounded-lg font-medium transition-all duration-300 hover:shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Support</span>
                </Link>
                <a
                  href="tel:+1234567890"
                  className="group flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 hover:border-black rounded-lg font-medium transition-all duration-300 hover:shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Error Code: 404 • Page Not Found • 
                {isRedirecting ? (
                  <span className="inline-flex items-center ml-2 text-black">
                    <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                    Redirecting...
                  </span>
                ) : (
                  <span className="ml-1">
                    Redirecting to home in {countdown} seconds
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
