"use client";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Shield,
  Users,
  Lock,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarContent = () => (
    <>
      <nav className="space-y-2 flex-1">
        <Link
          href="/"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Home className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">Home</span>
        </Link>

        <Link
          href="/admin"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Shield className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">Admin Dashboard</span>
        </Link>

        <button
          onClick={() => setIsAccountOpen(!isAccountOpen)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Account Settings</span>
          </div>
          {isAccountOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {isAccountOpen && (
          <div className="ml-6 space-y-1">
            <Link
              href="/account/user-management"
              className="block p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ➜ User Management
            </Link>
            <Link
              href="/account/content-moderation"
              className="block p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ➜ Content Moderation
            </Link>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <Link
            href="/privacy"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600"
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </Link>

          <Link
            href="/terms"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600"
          >
            <Shield className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </Link>

          <div className="text-xs text-gray-500 px-2">
            <p>© 2025 SU_DeepMinders. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`w-64 min-h-screen bg-white shadow-xl transition-transform duration-300 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col p-6">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-white shadow-md py-4 px-6">
          <SidebarContent />
        </div>
        <div className="w-64" /> {/* Spacer for content */}
      </div>
    </>
  );
}