"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    } else {
      router.push("/newsfeed");
    }
  }, [isAuthenticated, router]);

  // Return loading state while redirect happens
  return <main className="min-h-screen p-4">Loading...</main>;
}
