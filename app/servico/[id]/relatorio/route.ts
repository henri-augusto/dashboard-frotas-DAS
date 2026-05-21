import { prisma } from "@/lib/prisma";
import { generateServiceReportPdf } from "@/lib/reports/service-pdf";

export const runtime = "nodejs";

function formatDateForFilename(date: Date) {
  const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day}${month}${year}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const service = await prisma.serviceReport.findUnique({
    where: { id },
    include: { vehicle: true },
  });

  if (!service) {
    return new Response("Relatório não encontrado.", { status: 404 });
  }

  if (service.status !== "ENCERRADO") {
    return new Response(
      "O relatório em PDF só está disponível após o encerramento do serviço.",
      { status: 400 }
    );
  }

  const pdfBuffer = await generateServiceReportPdf(service);
  const filename = `relatorio-${formatDateForFilename(service.startedAt)}-${service.vehicle.prefixo}-${service.reMilitar}.pdf`;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
