'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the newsfeed page
    router.push('/newsfeed');
  }, [router]);

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">News Feed</h1>
      {/* Add your newsfeed content here */}
    </main>
  );
}
