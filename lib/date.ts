// WIB (Western Indonesia Time) = UTC+7
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Get today's date in WIB as "YYYY-MM-DD" */
export function todayWIB(): string {
  return new Date(Date.now() + WIB_OFFSET_MS).toISOString().split("T")[0];
}

/** Get current datetime in WIB as ISO string */
export function nowWIB(): string {
  return new Date(Date.now() + WIB_OFFSET_MS).toISOString();
}
