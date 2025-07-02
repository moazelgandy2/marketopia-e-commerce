"use client";

import { Phone, Smartphone } from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo and Contact */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 border rounded-lg flex items-center justify-center">
                <Image
                  src={"/images/logo.png"}
                  width={650}
                  height={650}
                  alt="Logo"
                  className="object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold">Marketopia</span>
            </div>

            <div>
              <h3 className="font-semibold mb-3 md:mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Whatsapp</span>
                </div>
                <p className="text-sm opacity-90">+1 202-918-2132</p>
                <div className="flex items-center gap-2 mt-4">
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </div>
                <p className="text-sm opacity-90">+1 202-918-2132</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 md:mb-4">Download App</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-black rounded-lg px-3 md:px-4 py-2 flex items-center gap-2">
                  <span className="text-xs">📱</span>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold text-sm">App Store</div>
                  </div>
                </div>
                <div className="bg-black rounded-lg px-3 md:px-4 py-2 flex items-center gap-2">
                  <span className="text-xs">📱</span>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-semibold text-sm">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Popular Categories */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4">
              Most Popular Categories
            </h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Staples
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Beverages
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Personal Care
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Home Care
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Baby Care
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Vegetables & Fruits
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Snacks & Foods
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Dairy & Bakery
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4">Customer Services</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  E-waste Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Cancellation & Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Decorative element - hidden on small screens */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 opacity-10">
              <div className="w-32 h-32 border-4 border-white rounded-full absolute top-0 right-0"></div>
              <div className="w-24 h-24 border-2 border-white rounded-full absolute bottom-8 right-8"></div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 md:mt-12 pt-4 md:pt-6 text-center text-sm opacity-75">
          © 2023 All rights reserved. Reliance Retail Ltd.
        </div>
      </div>
    </footer>
  );
};
