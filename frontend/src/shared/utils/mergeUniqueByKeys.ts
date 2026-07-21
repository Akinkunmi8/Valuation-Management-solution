export function mergeUniqueByKey<T>(
  items: T[],
  keySelector: (item: T) => string,
): T[] {
  const map = new Map<string, T>();

  items.forEach((item) => {
    map.set(keySelector(item), item);
  });

  return [...map.values()];
}
