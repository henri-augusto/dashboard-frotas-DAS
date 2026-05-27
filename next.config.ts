import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["10.60.53.193"],
  serverExternalPackages: ["pdfkit"],
  outputFileTracingIncludes: {
    "/servico/[id]/relatorio": ["./node_modules/pdfkit/js/data/**/*"],
  },
};

export default nextConfig;
