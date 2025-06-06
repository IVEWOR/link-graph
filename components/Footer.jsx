// /components/Footer.jsx
import { Code2, Github, Link } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t-4 border-green-400 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-green-400" strokeWidth={3} />
              <h3 className="text-2xl font-bold text-green-400 pixel-text">
                LINKGRAPH
              </h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md pixel-text">
              // Modern way for devs to share complete tech identity.
              <br />
              // From code to gear, showcase everything unique.
            </p>
            <div className="flex space-x-4">
              <div className="border-2 border-cyan-400 p-2 hover:bg-cyan-400 hover:text-black transition-colors cursor-pointer">
                <Github
                  className="h-6 w-6 text-cyan-400 hover:text-black"
                  strokeWidth={3}
                />
              </div>
              <div className="border-2 border-white p-2 hover:bg-white hover:text-black transition-colors cursor-pointer">
                <Link
                  className="h-6 w-6 text-white hover:text-black"
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-green-400 font-bold mb-4 pixel-text">
              {">"} PRODUCT
            </h4>
            <ul className="space-y-2 text-gray-400 pixel-text">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  {">"} Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  {">"} Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  {">"} Examples
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  {">"} Templates
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-cyan-400 font-bold mb-4 pixel-text">
              {">"} SUPPORT
            </h4>
            <ul className="space-y-2 text-gray-400 pixel-text">
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  {">"} Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  {">"} Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  {">"} Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  {">"} Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-green-400 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm pixel-text">
            // © 2024 LinkGraph. Built with ❤️ for developers.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-green-400 text-sm transition-colors pixel-text"
            >
              {">"} Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 text-sm transition-colors pixel-text"
            >
              {">"} Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors pixel-text"
            >
              {">"} Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
