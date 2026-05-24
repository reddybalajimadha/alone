"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminDeleteButtonProps {
  reportId: string;
  reportName: string;
}

export default function AdminDeleteButton({ reportId, reportName }: AdminDeleteButtonProps) {
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedAdmin = localStorage.getItem("alone_admin_password");
    if (savedAdmin) {
      setAdminPassword(savedAdmin);
    }
  }, []);

  if (!adminPassword) return null;

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the monograph for "${reportName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/reports?id=${reportId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminPassword}`,
        },
      });

      if (res.ok) {
        router.push("/");
        // Give Next.js router a moment to register redirect, then trigger refresh
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete monograph");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the monograph");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="font-serif text-sm italic text-ink-faint hover:text-ink transition-colors focus:outline-none ml-auto"
    >
      Delete Monograph &times;
    </button>
  );
}
