import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">Style<span className="text-indigo-400">Hive</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium clothing for every occasion. Quality fabrics, modern designs, delivered to your door.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Shop All</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">Cart</Link></li>
              <li><Link to="/my-orders" className="hover:text-indigo-400 transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="flex gap-4">
              <a href="mailto:support@stylehive.com" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FiMail size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">support@stylehive.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} StyleHive. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
