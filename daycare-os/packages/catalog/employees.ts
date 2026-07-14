/* The 14 daycare AI employee types (PRODUCT_ARCHITECTURE §6).
   HARD RULE: an employee is only assignable when its full vertical slice
   works end-to-end. Unfinished employees are visible but locked with the
   phase that delivers them — they are never sold as working. */

export interface EmployeeType {
  key: string;
  name: string;
  description: string;
  /** null = fully working now; otherwise the roadmap phase that completes it */
  availableInPhase: number | null;
  engineType: string | null; // mapping to engine agentType where applicable
}

export const EMPLOYEE_TYPES: EmployeeType[] = [
  { key: "parent-enquiry",  name: "Parent Enquiry AI",       engineType: "website-enquiry",   availableInPhase: null,
    description: "Answers parent questions instantly from approved knowledge and captures every enquiry." },
  { key: "website",         name: "Website AI",              engineType: "website-enquiry",   availableInPhase: null,
    description: "Runs the website chat widget — converts visitors into captured, qualified enquiries." },
  { key: "tour-booking",    name: "Tour Booking AI",         engineType: "booking",           availableInPhase: null,
    description: "Offers and books tour requests the moment a parent shows interest." },
  { key: "waitlist",        name: "Waitlist AI",             engineType: "waitlist-followup", availableInPhase: null,
    description: "Adds families to the waitlist and keeps them warm until a spot opens." },
  { key: "follow-up",       name: "Follow-up AI",            engineType: "whatsapp-followup", availableInPhase: null,
    description: "Prepares and schedules follow-ups so no enquiry goes cold." },
  { key: "whatsapp",        name: "WhatsApp AI",             engineType: "whatsapp-followup", availableInPhase: 10,
    description: "Full two-way WhatsApp conversations (requires WhatsApp Business API connection)." },
  { key: "email",           name: "Email AI",                engineType: "email-inbox",       availableInPhase: 10,
    description: "Classifies and answers enquiry emails (requires email integration)." },
  { key: "phone",           name: "Phone AI",                engineType: "missed-call",       availableInPhase: 7,
    description: "Recovers missed calls and manages callbacks (requires phone provider)." },
  { key: "registration",    name: "Registration AI",         engineType: null,                availableInPhase: 6,
    description: "Guides parents through enrolment step by step." },
  { key: "review",          name: "Review AI",               engineType: "review",            availableInPhase: 7,
    description: "Requests reviews from happy parents; routes unhappy feedback privately." },
  { key: "parent-communication", name: "Parent Communication AI", engineType: "marketing-content", availableInPhase: 7,
    description: "Drafts announcements, reminders and notices for approval." },
  { key: "activity-content", name: "Activity & Content AI",  engineType: "activity-planner",  availableInPhase: 8,
    description: "Suggests age-appropriate activities and weekly themes." },
  { key: "printable",       name: "Printable AI",            engineType: "activity-planner",  availableInPhase: 8,
    description: "Generates real, downloadable printable packs." },
  { key: "knowledge",       name: "Knowledge AI",            engineType: null,                availableInPhase: 9,
    description: "Learns from the daycare website and documents; keeps answers cited and current." },
];

export const WORKSPACE_MODULES: { key: string; name: string; availableInPhase: number | null }[] = [
  { key: "home",          name: "Home / Command Center",   availableInPhase: 3 },
  { key: "workforce",     name: "AI Workforce",            availableInPhase: 4 },
  { key: "inbox",         name: "Parent Inbox",            availableInPhase: 5 },
  { key: "enquiries",     name: "Enquiries",               availableInPhase: 5 },
  { key: "tours",         name: "Tours",                   availableInPhase: 6 },
  { key: "waitlist",      name: "Waitlist",                availableInPhase: 6 },
  { key: "registrations", name: "Registrations",           availableInPhase: 6 },
  { key: "communication", name: "Parent Communication",    availableInPhase: 7 },
  { key: "phone",         name: "Phone & Callbacks",       availableInPhase: 7 },
  { key: "reviews",       name: "Reviews & Reputation",    availableInPhase: 7 },
  { key: "activities",    name: "Activities",              availableInPhase: 8 },
  { key: "printables",    name: "Printable Hub",           availableInPhase: 8 },
  { key: "knowledge",     name: "Knowledge Hub",           availableInPhase: 9 },
  { key: "documents",     name: "Documents",               availableInPhase: 9 },
  { key: "automations",   name: "Automations",             availableInPhase: 10 },
  { key: "integrations",  name: "Integrations",            availableInPhase: 10 },
  { key: "analytics",     name: "Analytics",               availableInPhase: 11 },
  { key: "team",          name: "Team",                    availableInPhase: 11 },
];

export function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "daycare";
}
