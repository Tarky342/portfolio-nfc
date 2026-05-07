"use client";

import config from "@/sanity.config";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false },
);

export default function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div suppressHydrationWarning>
      <NextStudio config={config} />
    </div>
  );
}
