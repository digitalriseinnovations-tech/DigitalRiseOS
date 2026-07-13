/* Storage adapter contract for the AI engine.
   The engine only ever touches storage through this interface, so the
   backing store can be in-memory (tests), Supabase (production), or
   anything else without touching engine logic. */

export type Collection =
  | "businesses"
  | "agents"
  | "leads"
  | "conversations"
  | "bookings"
  | "reviews"
  | "tasks";

export interface Record_ {
  id: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface StorageAdapter {
  uid(): string;
  now(): string;
  list(col: Collection, filter?: Partial<Record_>): Record_[];
  get(col: Collection, id: string): Record_ | null;
  getBusinessBySlug(slug: string): Record_ | null;
  create(col: Collection, obj: Partial<Record_>): Record_;
  update(col: Collection, id: string, patch: Partial<Record_>): Record_ | null;
  remove(col: Collection, id: string): void;
  clearAll(): void;
}

/** In-memory adapter — used by tests and as the reference implementation.
    Mirrors the behaviour of the legacy localStorage DRS exactly. */
export function createMemoryStorage(): StorageAdapter {
  const store = new Map<Collection, Record_[]>();
  const read = (col: Collection) => {
    if (!store.has(col)) store.set(col, []);
    return store.get(col)!;
  };
  const uid = () =>
    "xxxxxxxx-xxxx-4xxx".replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)) +
    "-" +
    Date.now().toString(36) +
    Math.floor(Math.random() * 1e4).toString(36);
  const now = () => new Date().toISOString();

  return {
    uid,
    now,
    list(col, filter) {
      const arr = read(col);
      if (!filter) return arr;
      return arr.filter((r) =>
        Object.keys(filter).every((k) => (r as Record<string, unknown>)[k] === (filter as Record<string, unknown>)[k])
      );
    },
    get(col, id) {
      return read(col).find((r) => r.id === id) || null;
    },
    getBusinessBySlug(slug) {
      return read("businesses").find((b) => b.slug === slug) || null;
    },
    create(col, obj) {
      const rec = { id: uid(), createdAt: now(), ...obj } as Record_;
      read(col).unshift(rec);
      return rec;
    },
    update(col, id, patch) {
      const arr = read(col);
      const i = arr.findIndex((r) => r.id === id);
      if (i === -1) return null;
      arr[i] = { ...arr[i], ...patch, updatedAt: now() };
      return arr[i];
    },
    remove(col, id) {
      store.set(col, read(col).filter((r) => r.id !== id));
    },
    clearAll() {
      store.clear();
    },
  };
}
