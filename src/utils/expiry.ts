export function isExpired(createdAt: string): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const expirationDate = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000); // 14일 후

  return now > expirationDate;
}

export function getActiveItems<T extends { created_at: string }>(
  items: T[]
): T[] {
  return items.filter((item) => !isExpired(item.created_at));
}

export function getExpiredItems<T extends { created_at: string }>(
  items: T[]
): T[] {
  return items.filter((item) => isExpired(item.created_at));
}
