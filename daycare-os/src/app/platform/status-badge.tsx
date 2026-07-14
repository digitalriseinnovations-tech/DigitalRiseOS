const STATUS_BADGE: Record<string, string> = {
  draft: "badge-neutral", account_created: "badge-info", owner_invited: "badge-info",
  owner_activated: "badge-primary", knowledge_pending: "badge-warning",
  channels_pending: "badge-warning", ai_setup_pending: "badge-warning",
  testing: "badge-primary", live: "badge-success", suspended: "badge-danger", archived: "badge-neutral",
};

export function statusBadge(s: string) {
  return <span className={`badge ${STATUS_BADGE[s] || "badge-neutral"}`}>{(s || "draft").replace(/_/g, " ")}</span>;
}
