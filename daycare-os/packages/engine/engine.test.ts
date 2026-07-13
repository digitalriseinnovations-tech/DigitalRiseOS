/* Ported from the Phase-1 Node harnesses (28 + 26 checks).
   Validates the engine end-to-end against the in-memory adapter. */
import { describe, it, expect, beforeAll } from "vitest";
import { buildEngine, createMemoryStorage, importer, catalog, type Engine } from "./index";
import type { StorageAdapter } from "./storage";

describe("engine e2e — childcare business (original 28-check suite)", () => {
  let S: StorageAdapter, E: Engine;
  let biz: any, agent: any;
  const ctx: any = {};

  beforeAll(async () => {
    S = createMemoryStorage();
    E = buildEngine(S);
    const basics = {
      name: "Little Stars Daycare", website: "littlestars.ca", industryGroup: "childcare",
      businessType: "Daycare", location: "Mississauga, ON", phone: "+1 905-555-0000",
      email: "hi@littlestars.ca", whatsapp: "+1 905-555-0000",
      reviewLink: "https://g.page/r/ls/review", bookingLink: "",
    };
    const intel = await importer.runImport(basics, { instagram: "https://instagram.com/ls" }, null);
    expect(intel.summary).toContain("Little Stars");
    expect(intel.faqs.length).toBeGreaterThanOrEqual(3);
    expect(intel.google.rating).toBeTruthy();
    expect(intel.social.tone).toBeTruthy();
    expect(Array.isArray(intel.missing)).toBe(true);

    biz = E.createBusiness({
      ...basics,
      selectedAgents: ["website-enquiry", "booking", "whatsapp-followup"],
      knowledge: { escalation: "Director Amy — 905-555-0199" },
      intel, manualRules: ["Sibling discount is 15% this year"], trained: true,
    });
    agent = S.list("agents", { businessId: biz.id }).find((a: any) => a.agentType === "website-enquiry");
  }, 30000);

  it("creates business with intel and 3 job-based agents", () => {
    expect((S.getBusinessBySlug("little-stars-daycare") as any).intel).toBeTruthy();
    const agents = S.list("agents", { businessId: biz.id });
    expect(agents.length).toBe(3);
    expect((agents[0] as any).role).toBeTruthy();
    expect((agents[0] as any).supportedIntents.length).toBeGreaterThan(0);
  });

  it("answers price from knowledge", () => {
    const r = E.converse(biz, agent, "How much are your fees?", ctx);
    expect(r.intent).toBe("price");
    expect(r.knowledgeSource).toBeTruthy();
  });

  it("answers subsidy from imported FAQ", () => {
    const r = E.converse(biz, agent, "Do you offer subsidy?", ctx);
    expect(r.intent).toBe("subsidy");
    expect(r.reply.toLowerCase()).toMatch(/cwelcc|subsid/);
  });

  it("tour intent starts capture and flags booking offered", () => {
    const r = E.converse(biz, agent, "Can I book a tour this week?", ctx);
    expect(r.intent).toBe("tour");
    expect(r.reply).toMatch(/name/i);
    expect(r.checks.bookingOffered).toBe(true);
  });

  it("captures name then phone, saving the lead", () => {
    const r1 = E.converse(biz, agent, "Sarah Miller", ctx);
    expect(r1.reply).toMatch(/phone|number|email/i);
    const r2 = E.converse(biz, agent, "905-555-1234", ctx);
    expect(r2.checks.leadCaptured).toBe(true);
    expect(r2.checks.dataSaved).toBe(true);
  });

  it("persists structured outcomes: lead, booking request, follow-up task", () => {
    const leads = S.list("leads", { businessId: biz.id }) as any[];
    expect(leads.length).toBe(1);
    expect(leads[0].status).toBe("booking-requested");
    expect(leads[0].name).toBe("Sarah Miller");
    expect(leads[0].score).toBe("hot");
    expect(leads[0].nextFollowUpDue).toBeTruthy();
    const bookings = S.list("bookings", { businessId: biz.id }) as any[];
    expect(bookings.length).toBe(1);
    expect(bookings[0].status).toBe("request");
    const tasks = S.list("tasks", { businessId: biz.id }) as any[];
    expect(tasks.some((t) => t.type === "whatsapp-followup")).toBe(true);
  });

  it("manual business rule (L4) overrides imported knowledge", () => {
    const r = E.converse(biz, agent, "Do you have a sibling discount?", {});
    expect(r.reply).toMatch(/15%/);
  });

  it("complaint escalates and creates urgent callback task", () => {
    const c: any = {};
    const r = E.converse(biz, agent, "I am very unhappy with how pickup was handled today", c);
    expect(r.intent).toBe("complaint");
    expect(r.checks.escalationNeeded).toBe(true);
    const r2 = E.converse(biz, agent, "Jane Doe, 416-555-9999", c);
    expect(r2.checks.leadCaptured).toBe(true);
    const escLead = (S.list("leads", { businessId: biz.id }) as any[]).find((l) => l.status === "escalated");
    expect(escLead).toBeTruthy();
    expect((S.list("tasks", { leadId: escLead.id }) as any[]).some((t) => t.type === "callback")).toBe(true);
  });

  it("dental business: insurance FAQ + emergency escalation", async () => {
    const dIntel = await importer.runImport(
      { name: "Bright Dental", website: "bd.ca", industryGroup: "healthcare", businessType: "Dental Clinic", location: "Toronto" },
      {}, null
    );
    const dBiz = E.createBusiness({
      name: "Bright Dental", industryGroup: "healthcare", businessType: "Dental Clinic",
      selectedAgents: ["website-enquiry"], intel: dIntel, knowledge: {}, trained: true,
    });
    const dAgent = S.list("agents", { businessId: (dBiz as any).id })[0];
    const dCtx: any = {};
    const r1 = E.converse(dBiz, dAgent, "Do you accept insurance?", dCtx);
    expect(r1.intent).toBe("insurance");
    expect(r1.reply).toMatch(/insurance|bill/i);
    const r2 = E.converse(dBiz, dAgent, "I have a toothache and need urgent help", dCtx);
    expect(r2.intent).toBe("emergency");
    expect(r2.checks.escalationNeeded).toBe(true);
  }, 30000);
});

describe("intent + memory + human responses (original 26-check suite)", () => {
  let S: StorageAdapter, E: Engine;
  let biz: any, agent: any;

  beforeAll(async () => {
    S = createMemoryStorage();
    E = buildEngine(S);
    const intel = await importer.runImport(
      { name: "Sunny Kids", website: "sk.ca", industryGroup: "childcare", businessType: "Daycare", location: "Brampton, ON", phone: "+1 905-555-1111" },
      {}, null
    );
    biz = E.createBusiness({
      name: "Sunny Kids", industryGroup: "childcare", businessType: "Daycare",
      phone: "+1 905-555-1111", reviewLink: "https://g.page/r/sk/review",
      selectedAgents: ["website-enquiry"], intel,
      knowledge: {
        meals: "Hot lunch and two snacks daily, included in fees. Nut-free facility, allergy plans supported.",
        fees: "Toddlers $65/day, preschool $58/day. CWELCC subsidy accepted.",
        hours: "Monday–Friday 7:30 AM – 6:00 PM.",
        ageGroups: "Infants 6–18 months, Toddlers 18 months–2.5 years, Preschool 2.5–4 years",
        waitlistRules: "Waitlist is free to join — no deposit.",
        tourTimes: "Tours Tuesday & Thursday 10 AM.",
        policies: "Sick policy: children must be symptom-free for 24 hours before returning.",
        curriculum: "Play-based learning with weekly themes and outdoor play twice daily.",
        escalation: "Director Amy — 905-555-0199",
      },
      trained: true,
    });
    agent = S.list("agents", { businessId: biz.id })[0];
  }, 30000);

  it("THE BUG: meals and allergy give different, intent-specific answers", () => {
    const meals = E.converse(biz, agent, "What meals do you provide?", {});
    const allergy = E.converse(biz, agent, "My daughter has a nut allergy — can you handle that?", {});
    expect(meals.intent).toBe("meals");
    expect(allergy.intent).toBe("allergy");
    expect(meals.reply).not.toBe(allergy.reply);
    expect(meals.reply).toMatch(/lunch/i);
    expect(meals.reply).toMatch(/snack/i);
    expect(allergy.reply).toMatch(/individual/i);
    expect(allergy.reply).toMatch(/age/i);
    expect(allergy.reply).not.toMatch(/two snacks daily, included in fees/i);
  });

  it("remembers allergy + age through capture; lead notes carry details", () => {
    const c: any = {};
    E.converse(biz, agent, "My daughter has a nut allergy — can you handle that?", c);
    const r2 = E.converse(biz, agent, "She's 3 years old, peanut allergy", c);
    expect(r2.reply).toMatch(/noted/i);
    expect(r2.reply).toMatch(/name/i);
    E.converse(biz, agent, "Priya Sharma", c);
    const r4 = E.converse(biz, agent, "905-555-8888", c);
    expect(r4.checks.leadCaptured).toBe(true);
    expect(r4.reply).toMatch(/3-year-old|allergy/i);
    const lead = (S.list("leads", { businessId: biz.id }) as any[])[0];
    expect(lead.notes).toMatch(/Child: 3/);
    expect(lead.notes).toMatch(/Allergy noted/i);
  });

  it("uses remembered child age in later fees answer", () => {
    const c: any = {};
    E.converse(biz, agent, "Hi, I have a 2 year old", c);
    const fees = E.converse(biz, agent, "How much are your fees?", c);
    expect(fees.reply).toMatch(/2-year-old/i);
  });

  it("meals after allergy acknowledges known allergy context", () => {
    const c: any = {};
    E.converse(biz, agent, "My son has a dairy allergy", c);
    const meals2 = E.converse(biz, agent, "What meals do you serve?", c);
    expect(meals2.reply).toMatch(/allergy|individual needs/i);
  });

  it("daycare intents: sick policy, existing parent, activities, waitlist, holiday, printables", () => {
    expect(E.converse(biz, agent, "What happens if my son has a fever?", {}).intent).toBe("sick-policy");
    const s2 = E.converse(biz, agent, "My child attends — I need to report an absence today", {});
    expect(s2.intent).toBe("existing-parent");
    expect(s2.reply).toMatch(/name/i);
    const s3 = E.converse(biz, agent, "What do the kids do all day?", {});
    expect(s3.intent).toBe("activity-planning");
    expect(s3.reply).toMatch(/play-based|themes/i);
    expect(E.converse(biz, agent, "How do I join the waitlist?", {}).reply).toMatch(/free to join/i);
    expect(E.converse(biz, agent, "Do you have any printable worksheets?", {}).intent).toBe("printables");
  });

  it("unknown topics use the approved honest fallback with low confidence", () => {
    const c: any = {};
    E.converse(biz, agent, "Do you have a swimming pool on site?", c);
    const f2 = E.converse(biz, agent, "So is there a pool or not?", c);
    expect(f2.reply).toMatch(/correct information/i);
    expect(f2.reply).toMatch(/daycare team/i);
    expect(f2.confidence).toBe("low");
  });

  it("knowledge answers report high confidence, source and next action", () => {
    const conf = E.converse(biz, agent, "What are your opening hours?", {});
    expect(conf.confidence).toBe("high");
    expect(conf.knowledgeSource).toBeTruthy();
    expect(conf.nextAction).toBeTruthy();
  });

  it("varies phrasing on repeat questions", () => {
    const c: any = {};
    const m1 = E.converse(biz, agent, "What meals do you provide?", c);
    const m2 = E.converse(biz, agent, "Tell me about the meals again?", c);
    expect(m1.reply).not.toBe(m2.reply);
  });

  it("setup status lifecycle: trained → test-passed → live; draft → needs-training via syncAgents", () => {
    expect(E.bizSetupStatus(biz)).toBe("trained");
    S.update("businesses", biz.id, { testPassed: true });
    expect(E.bizSetupStatus(S.get("businesses", biz.id))).toBe("test-passed");
    S.update("businesses", biz.id, { setupStatus: "live" });
    expect(E.bizSetupStatus(S.get("businesses", biz.id))).toBe("live");
    const draft = S.create("businesses", { name: "Draft Biz", slug: "draft-biz", setupStatus: "draft", industryGroup: "childcare" });
    expect(E.bizSetupStatus(draft)).toBe("draft");
    E.syncAgents(draft, ["website-enquiry", "booking"]);
    expect(S.list("agents", { businessId: draft.id }).length).toBe(2);
    expect(E.bizSetupStatus(S.get("businesses", draft.id))).toBe("needs-training");
  });

  it("catalog exposes the daycare skill map", () => {
    expect(catalog.daycareSkills.length).toBe(12);
    expect(catalog.skillsToAgents(["parent-enquiry", "availability-check", "tour-booking"])).toEqual([
      "website-enquiry", "booking",
    ]);
  });
});
