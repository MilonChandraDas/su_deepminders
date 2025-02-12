"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Shield,
  Users,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white shadow-md p-6">
      <div className="fixed left-0 top-0 h-screen flex flex-col bg-white py-4 px-6">
        {/* Main Navigation */}
        <nav className="space-y-2 flex-1">
          {/* Home */}
          <Link
            href="/"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <Home className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Home</span>
          </Link>

          {/* Admin Dashboard */}
          <Link
            href="/admin"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Admin Dashboard</span>
          </Link>

          {/* Account Settings (Collapsible) */}
          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">
                Account Settings
              </span>
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
                className="block p-2 rounded-lg hover:bg-gray-100"
              >
                ➜ User Management
              </Link>
              <Link
                href="/account/content-moderation"
                className="block p-2 rounded-lg hover:bg-gray-100"
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
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-sm text-gray-600"
            >
              <Lock className="w-4 h-4" />
              <span>Privacy Policy</span>
            </Link>

            <Link
              href="/terms"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-sm text-gray-600"
            >
              <Shield className="w-4 h-4" />
              <span>Terms & Conditions</span>
            </Link>

            <div className="text-xs text-gray-500 px-2">
              <p>© 2025 SU_DeepMinders. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
