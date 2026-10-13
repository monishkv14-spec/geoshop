import React from 'react';
import { Globe, Shield, ExternalLink, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-extrabold text-lg">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>GeoShop</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Global product discovery and location-based shopping comparison platform. Powered by Three.js, React, Node.js, Express & Prisma ORM.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3">Core Features</h4>
          <ul className="space-y-2">
            <li>• Interactive 3D World Globe</li>
            <li>• Location Marker Availability</li>
            <li>• Country Visual Atmosphere Shift</li>
            <li>• Price, Rating & Quality Comparison</li>
            <li>• Direct Merchant Redirection</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3">Supported Platforms</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-cyan-400" /> Amazon India / US / UK / JP / UAE</li>
            <li className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-cyan-400" /> Flipkart India</li>
            <li className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-cyan-400" /> Best Buy US & B&H Photo</li>
            <li className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-cyan-400" /> MediaMarkt DE & Rakuten JPN</li>
            <li className="flex items-center gap-1.5"><ExternalLink className="w-3 h-3 text-cyan-400" /> JB Hi-Fi & Regional Outlets</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3">Architecture & Tech</h4>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Full-Stack MSc Project Architecture</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Verified Demo & API Data Layer</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>© 2026 GeoShop. Global Location-Based Comparison Layer. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>Terms of Service</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>API Data Integration</span>
        </div>
      </div>
    </footer>
  );
};
