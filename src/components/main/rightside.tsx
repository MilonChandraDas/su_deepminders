"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { X, MenuSquare } from "lucide-react";
import { districts } from "@/lib/districts";
import { getUser, UserResponse } from "@/lib/api.utils";

const Rightside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [districtId, setDistrictId] = useState<string>("");
  const [user, setUser] = useState<UserResponse | null>(null);

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    const fetchUser = async () => {
      const _user = await getUser();
      setUser(_user);
    };

    fetchUser();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SidebarContent = () => (
    <>
      {/* User Profile Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div>
            <p className="font-medium">{user?.email.split("@")[0]}</p>
            <p className="text-sm text-gray-500">{user?.email.split("@")[1]}</p>
          </div>
        </div>
      </div>

      {/* Heat Map Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Activity</h2>
        <div className="p-1 bg-gray-50 rounded-lg">
          <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
            <Image src="/bd_map.png" alt="Activity heat map" width={500} height={500} className="w-full h-full object-fit" quality={100} />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Division</label>
            <Select value={districtId} onValueChange={setDistrictId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md">
        {isOpen ? <X className="w-6 h-6 text-gray-600" /> : <MenuSquare className="w-6 h-6 text-gray-600" />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute right-0 w-80 h-full bg-white shadow-xl transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col p-6 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="fixed right-0 top-0 h-screen w-80 flex flex-col bg-white border-l p-6 overflow-y-auto">
          <SidebarContent />
        </div>
        <div className="w-80" /> {/* Spacer */}
      </div>
    </>
  );
};

export default Rightside;
