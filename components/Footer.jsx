/*
================================================================================
  FILE: components/Footer.jsx
  PURPOSE: Redesigned footer with a clean, modern layout.
================================================================================
*/
// components/Footer.jsx
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#111115] border-t border-gray-200 dark:border-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              LinkGraph
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4 max-w-md">
              The ultimate creator hub to showcase your complete digital
              identity.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Examples
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Resources
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Docs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; 2024 LinkGraph. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
