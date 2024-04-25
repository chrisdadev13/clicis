export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Month is zero-indexed
  const day = `${date.getDate()}`.padStart(2, "0");

  const monthQueryParam = `month=${year}-${month}`;
  const dateQueryParam = `date=${year}-${month}-${day}`;

  return `${monthQueryParam}&${dateQueryParam}`;
}
