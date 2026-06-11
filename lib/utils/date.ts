const REPORT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "short",
  timeStyle: "short",
};

export function formatReportDate(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", REPORT_DATE_FORMAT).format(d);
}

export function formatReportDateFromIso(value: string) {
  return formatReportDate(new Date(value));
}

export function todayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}
