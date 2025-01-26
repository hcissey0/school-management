import type { NextConfig } from "next";
import { Header } from "next/dist/lib/load-custom-routes";

const nextConfig: NextConfig = {
  /* config options here */
  // async headers(): Promise<Header[]> {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         // {
  //         //   key: "X-Content-Type-Options",
  //         //   value: "nosniff"
  //         // },
  //         // {
  //         //   key: "X-Frame-Options",
  //         //   value: "DENY"
  //         // },
  //         // {
  //         //   key: "Content-Security-Policy",
  //         //   value: "default-src 'self';"
  //         // },
  //         // {
  //         //   key: "Referrer-Policy",
  //         //   value: "origin-when-cross-origin"
  //         // },
  //         // {
  //         //   key: "Permissions-Policy",
  //         //   value: "camerahardware, microphonehardware"
  //         // }
  //       ]
  //     },
  //     // {
  //     //   source: "/sw.js",
  //     //   headers: [
  //     //     {
  //     //       key: "Cache-Control",
  //     //       value: "no-cache, no-store, must-revalidate"
  //     //     },
  //     //     {
  //     //       key: "Content-Type",
  //     //       value: "application/javascript"
  //     //     }
  //     //   ]
  //     // }
  //   ]
  // }
};

export default nextConfig;
