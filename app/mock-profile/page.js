// app/mock-profile/page.jsx
import React from "react";
import MockProfilePage from "@/components/MockProfilePage";

// Dynamically import your client-only MockProfile page
// const MockProfilePage = dynamic(
//   () => import("@/components/MockProfilePage"),
//   { ssr: false } // ensure this only ever runs on the client
// );

export default function MPP() {
  return (
    // you can still wrap in Suspense if you like a fallback UI
    <React.Suspense
      fallback={<div className="text-center mt-12">Loading…</div>}
    >
      <MockProfilePage />
    </React.Suspense>
  );
}
