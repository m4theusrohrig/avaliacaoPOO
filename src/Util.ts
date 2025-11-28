// Util.ts
export function stringToDate(s: string): Date | null {
  // aceita dd/mm/yyyy ou yyyy-mm-dd
  s = (s || "").trim();
  if (!s) return null;

  // dd/mm/yyyy
  const regexBR = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const mBR = s.match(regexBR);
  if (mBR) {
    const day = Number(mBR[1]), month = Number(mBR[2]) - 1, year = Number(mBR[3]);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }

  // yyyy-mm-dd
  const dISO = new Date(s);
  return isNaN(dISO.getTime()) ? null : dISO;
}

export function dateToString(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
