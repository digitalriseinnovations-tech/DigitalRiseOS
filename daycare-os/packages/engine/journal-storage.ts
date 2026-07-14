/* Journaled in-memory storage: the engine runs synchronously against
   memory, and every mutation is recorded so the API route can flush it
   to Supabase afterwards (with memory-id → database-id remapping). */
import { createMemoryStorage, type StorageAdapter, type Collection, type Record_ } from "./storage";

export interface JournalEntry {
  op: "create" | "update";
  col: Collection;
  id: string;                 // memory id
  rec?: Record_;              // for create (full record)
  patch?: Partial<Record_>;   // for update
}

export function createJournalStorage(): { storage: StorageAdapter; journal: JournalEntry[] } {
  const mem = createMemoryStorage();
  const journal: JournalEntry[] = [];
  const storage: StorageAdapter = {
    ...mem,
    create(col, obj) {
      const rec = mem.create(col, obj);
      journal.push({ op: "create", col, id: rec.id, rec });
      return rec;
    },
    update(col, id, patch) {
      const rec = mem.update(col, id, patch);
      journal.push({ op: "update", col, id, patch });
      return rec;
    },
  };
  return { storage, journal };
}
