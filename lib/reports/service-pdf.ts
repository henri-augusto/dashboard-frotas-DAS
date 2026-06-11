import PDFDocument from "pdfkit";
import type { ServiceReport, Vehicle } from "@prisma/client";
import { formatReportDate } from "@/lib/utils/date";

type ServiceWithVehicle = ServiceReport & { vehicle: Vehicle };

const COLORS = {
  primary: "#201a17",
  secondary: "#b8323a",
  muted: "#756a60",
  border: "#ded2c3",
  panel: "#f4efe7",
  white: "#fffaf2",
};

const MARGIN = 48;
const FOOTER_RESERVE = 78;

function contentWidth(doc: InstanceType<typeof PDFDocument>) {
  return doc.page.width - MARGIN * 2;
}

function drawFooter(doc: InstanceType<typeof PDFDocument>) {
  const width = contentWidth(doc);
  const footerTop = doc.page.height - MARGIN - FOOTER_RESERVE + 18;
  const generatedAt = formatReportDate(new Date());

  doc
    .save()
    .moveTo(MARGIN, footerTop)
    .lineTo(MARGIN + width, footerTop)
    .strokeColor(COLORS.border)
    .lineWidth(0.75)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(`Documento gerado em ${generatedAt}.`, MARGIN, footerTop + 14, {
      width,
      align: "center",
    });

  doc
    .font("Helvetica-Oblique")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(
      "Documento apenas para suporte na elaboração do RSM.",
      MARGIN,
      footerTop + 28,
      { width, align: "center" }
    );

  doc.restore();
}

function drawHeader(doc: InstanceType<typeof PDFDocument>) {
  const width = contentWidth(doc);

  doc
    .save()
    .rect(MARGIN, MARGIN, width, 72)
    .fill(COLORS.primary);

  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("Relatório de Serviço", MARGIN + 20, MARGIN + 18, { width: width - 40 });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#e8dfd4")
    .text("DAS · DTIC — Controle de Viaturas", MARGIN + 20, MARGIN + 44, {
      width: width - 40,
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.secondary)
    .text("ENCERRADO", MARGIN + width - 88, MARGIN + 22, {
      width: 68,
      align: "right",
    });

  doc.restore();
  doc.y = MARGIN + 88;
}

function ensureSpace(
  doc: InstanceType<typeof PDFDocument>,
  needed: number
) {
  const limit = doc.page.height - MARGIN - FOOTER_RESERVE;
  if (doc.y + needed > limit) {
    doc.addPage();
    doc.y = MARGIN;
  }
}

function addSection(
  doc: InstanceType<typeof PDFDocument>,
  title: string,
  rows: [string, string][]
) {
  const width = contentWidth(doc);
  const rowHeight = 18;
  const boxHeight = 34 + rows.length * rowHeight;
  const startY = doc.y;

  ensureSpace(doc, boxHeight + 16);

  doc
    .save()
    .roundedRect(MARGIN, startY, width, boxHeight, 6)
    .fill(COLORS.panel)
    .strokeColor(COLORS.border)
    .lineWidth(0.75)
    .stroke();

  doc
    .fillColor(COLORS.primary)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(title, MARGIN + 16, startY + 14, { width: width - 32 });

  let rowY = startY + 36;
  const labelWidth = 118;
  const valueX = MARGIN + 16 + labelWidth;

  for (const [label, value] of rows) {
    doc
      .fillColor(COLORS.muted)
      .font("Helvetica")
      .fontSize(9)
      .text(label, MARGIN + 16, rowY, { width: labelWidth - 8 });

    doc
      .fillColor(COLORS.primary)
      .font("Helvetica")
      .fontSize(9.5)
      .text(value, valueX, rowY, {
        width: width - labelWidth - 32,
        lineGap: 1,
      });

    rowY += rowHeight;
  }

  doc.restore();
  doc.y = startY + boxHeight + 14;
}

function addTextBlock(
  doc: InstanceType<typeof PDFDocument>,
  title: string,
  body: string
) {
  const width = contentWidth(doc);
  ensureSpace(doc, 60);

  const startY = doc.y;

  doc
    .fillColor(COLORS.primary)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(title, MARGIN, startY);

  doc
    .fillColor(COLORS.primary)
    .font("Helvetica")
    .fontSize(9.5)
    .text(body, MARGIN + 8, doc.y + 6, {
      width: width - 16,
      lineGap: 3,
    });

  doc.moveDown(0.6);
}

export function generateServiceReportPdf(
  service: ServiceWithVehicle
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: MARGIN,
      size: "A4",
      bufferPages: true,
    });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const kmPercorrido =
      service.kmFinal != null ? service.kmFinal - service.kmInicial : null;

    drawHeader(doc);

    addSection(doc, "Identificação", [
      ["ServiceID", service.id],
      ["Início", formatReportDate(service.startedAt)],
      [
        "Fim",
        service.endedAt ? formatReportDate(service.endedAt) : "—",
      ],
    ]);

    addSection(doc, "Militar", [
      ["RE", service.reMilitar],
      ["Nome de guerra", service.nomeGuerra || "—"],
      ["Encarregado", service.encarregado],
    ]);

    addSection(doc, "Viatura", [
      ["Prefixo", service.vehicle.prefixo],
      ["Modelo", service.vehicle.modelo],
      ["Patrimônio", service.vehicle.patrimonio],
      ["Placa", service.vehicle.placa],
    ]);

    addSection(doc, "Serviço", [
      ["Destino", service.destino],
      ["Missão", service.missao],
      ["KM inicial", String(service.kmInicial)],
      ["KM final", service.kmFinal != null ? String(service.kmFinal) : "—"],
      [
        "KM percorrido",
        kmPercorrido != null ? String(kmPercorrido) : "—",
      ],
    ]);

    if (service.observacoes) {
      addTextBlock(doc, "Observações", service.observacoes);
    }

    if (service.novidades) {
      addTextBlock(doc, "Novidades", service.novidades);
    }

    const pageRange = doc.bufferedPageRange();
    for (let i = 0; i < pageRange.count; i++) {
      doc.switchToPage(i);
      drawFooter(doc);
    }

    doc.end();
  });
}
