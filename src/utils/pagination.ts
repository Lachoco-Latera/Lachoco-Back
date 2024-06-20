export function fnPagination(page, limit, arr) {
  const defaultPage = page || 1;
  const defaultLimit = limit || 15;

  const startIndex = (defaultPage - 1) * defaultLimit;
  const endIndex = startIndex + defaultLimit;
  return arr.slice(startIndex, endIndex);
}
