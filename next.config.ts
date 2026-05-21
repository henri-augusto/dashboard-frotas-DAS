import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/servico/[id]/relatorio": ["./node_modules/pdfkit/js/data/**/*"],
  },
};

export default nextConfig;
