import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

/**
 * Footer component.
 *
 * This component renders the footer of the application.
 *
 * @returns {JSX.Element}
 */
function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Store</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your one-stop destination for premium quality products at
                unbeatable prices.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>Shipping Info</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>Returns</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                  <span>Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@store.com"
                  className="hover:text-primary transition-colors duration-300"
                >
                  info@store.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary transition-colors duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>123 Store Street, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2025 Store. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-primary transition-colors duration-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

