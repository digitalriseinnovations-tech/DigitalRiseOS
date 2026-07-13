/* Public API of the Daycare AI engine package. */
import catalog from "../catalog/raw.js";
import { createEngine } from "./engine.js";
import { DRI } from "./import-sim.js";
import { createMemoryStorage, type StorageAdapter } from "./storage";

export type { StorageAdapter, Collection, Record_ } from "./storage";
export { createMemoryStorage };
export { DRI as importer };
export { catalog };

export interface ConverseChecks {
  leadCaptured: boolean;
  bookingOffered: boolean;
  followUpSuggested: boolean;
  escalationNeeded: boolean;
  dataSaved: boolean;
}

export interface ConverseResult {
  reply: string;
  intent: string;
  intentLabel: string;
  confidence: "high" | "medium" | "low";
  nextAction: string;
  knowledgeSource: string | null;
  fallbackUsed: boolean;
  actions: { icon: string; label: string }[];
  outcomes: { type: string; id: string }[];
  checks: ConverseChecks;
}

export interface Engine {
  converse(biz: unknown, agent: unknown, msg: string, ctx: Record<string, unknown>): ConverseResult;
  detectIntent(msg: string): { primary: string; all: string[] };
  intentLabel(id: string): string;
  createBusiness(input: Record<string, unknown>): Record<string, unknown>;
  syncAgents(biz: unknown, types: string[]): unknown[];
  trainAgent(agentId: string, done?: (a: unknown) => void): void;
  trainAll(businessId: string, onEach?: (a: unknown, st: string) => void, onDone?: () => void): void;
  bizSetupStatus(biz: unknown): string;
  bizStats(businessId: string): Record<string, unknown[]>;
  agentStats(agentId: string): Record<string, unknown[]>;
  logConversation(biz: unknown, agent: unknown, messages: unknown[], leadId?: string | null, meta?: unknown): unknown;
  slugify(name: string): string;
  [key: string]: unknown;
}

/** Build an engine instance bound to a storage adapter. */
export function buildEngine(storage: StorageAdapter = createMemoryStorage()): Engine {
  return createEngine(storage, catalog) as unknown as Engine;
}
