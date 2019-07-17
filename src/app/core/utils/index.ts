export const range = (start, end) =>
  Array.from(Array(end - start), (_, index) => start + index);
