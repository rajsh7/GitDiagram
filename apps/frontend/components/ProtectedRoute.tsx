"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ✅ Protects pages that require authentication.
 * Redirects to /login if no token is found.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Checking authentication...</p>
      </div>
    );

  return <>{children}</>;
}
