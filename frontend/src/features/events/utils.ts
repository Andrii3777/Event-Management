// Converts an ISO datetime from the API into the value a <input type="datetime-local">
// expects, and back. Both directions are needed: the edit form pre-fills from
// the server's ISO string, and submission sends ISO back to the API.
export function toDatetimeLocalInput(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toIsoFromDatetimeLocal(value: string): string {
  return new Date(value).toISOString();
}
