/** Cavalier tab on the character and NPC sheets: the Dragon #148 cavalier's reminders and the starting funds roll. */
import * as CV from "./rules.mjs";

const MID = "frpg1e-cavalier148";
const esc = s => (globalThis.foundry?.utils?.escapeHTML ? foundry.utils.escapeHTML(String(s ?? "")) : String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]));
const box = (title, body) => `<div class="box"><h3 class="box-title">${title}</h3>${body}</div>`;

export function renderCavalierTab(app, element) {
  const root = element instanceof HTMLElement ? element : element?.[0] ?? app.element;
  const actor = app.actor ?? app.document;
  if (!root || !actor || !["character", "npc"].includes(actor.type)) return;
  const tabs = root.querySelector(".sheet-tabs"), scroll = root.querySelector(".tab-scroll");
  root.querySelector(".tab-body[data-tab='cavalier148']")?.remove();
  tabs?.querySelector("[data-tab='cavalier148']")?.remove();
  const html = tabHTML(actor);
  if (!tabs || !scroll || !html) return;
  const btn = document.createElement("button");
  btn.type = "button"; btn.dataset.action = "sheetTab"; btn.dataset.tab = "cavalier148"; btn.textContent = "Cavalier";
  tabs.append(btn);
  const sec = document.createElement("section");
  sec.className = "tab-body cv-tab"; sec.dataset.tab = "cavalier148"; sec.innerHTML = html;
  scroll.append(sec);
  if (app._tab === "cavalier148") { btn.classList.add("active"); sec.classList.add("active"); }
  sec.querySelector("[name='cv-social']")?.addEventListener("change", ev => {
    const v = Math.max(1, Math.min(100, parseInt(ev.currentTarget.value, 10) || 0));
    actor.setFlag(MID, "social", v);
  });
  sec.querySelector("[data-cv-roll='funds']")?.addEventListener("click", () => rollFunds(actor));
}

/** The tab's HTML, or "" when the actor has no Dragon #148 cavalier class. */
export function tabHTML(actor) {
  const s = actor.system;
  const c = (s.classInfo ?? []).find(x => x.key === CV.KEY);
  if (!c) return "";
  const L = Math.max(1, c.level ?? 1);
  const social = actor.getFlag?.(MID, "social") ?? actor.flags?.[MID]?.social ?? null;
  const f = social ? CV.fundsFor(social) : null;
  const elfish = /^(elf|half-elf)/.test(String(s.details?.race ?? ""));
  const out = [];
  out.push(box(`Cavalier ${L} <span class="hint">(${CV.SRC})</span>`, `
    <table class="cv-table">
      <tr><th>Weapons of choice</th><td><strong>${CV.choiceAttacks(L)}</strong> attacks a round</td><td class="hint">A lance, a sword (not short, khopesh or two-handed) or scimitar, and a horseman's mace, pick or flail, all taken at 1st level: +1 to hit, +2 mounted. Mark them on each weapon's sheet.</td></tr>
      <tr><th>Other weapons</th><td><strong>${L >= 13 ? "2/1" : L >= 7 ? "3/2" : "1/1"}</strong> attacks a round</td><td class="hint">Normal proficiency; −3 when not proficient (UA). No weapon specialization.</td></tr>
      <tr><th>Proficiency slots</th><td>${3 + Math.floor((L - 1) / 3)} weapon, ${2 + Math.floor((L - 1) / 3)} nonweapon</td><td class="hint">3 and 2 at 1st level, then one of each every three levels (printed “4th, 9th, etc.”). One nonweapon slot is riding, land-based (horses).</td></tr>
      <tr><th>Social class</th><td><input type="number" name="cv-social" min="1" max="100" value="${social ?? ""}" placeholder="d100"></td><td class="hint">UA p.82. Must be at least ${CV.MIN_SOCIAL} (upper middle class).${social && social < CV.MIN_SOCIAL ? ` <strong>${social} is too low for a cavalier.</strong>` : ""}</td></tr>
      <tr><th>Starting funds</th><td>${f ? `<button type="button" data-cv-roll="funds"><i class="fa-solid fa-dice"></i> Roll</button>` : ""}</td><td class="hint">${f ? `${esc(f[3])}` : "Enter the social class roll (56 or more) first"}. Replaces the UA starting equipment.</td></tr>
    </table>`));
  const later = [[9, "May build a castle or keep; once 20-50 miles around it are cleared, followers come (see the compendium): light and heavy cavalry, heavy infantry, crossbowmen, retainers and four craftsmen. The pennon is required once the castle is built."]];
  out.push(box("Rules to remember", `<ul class="cv-list">
    <li><strong>Requirements:</strong> strength, constitution and charisma 13 or more; no prime requisite and no experience bonus. Human, or elf or half-elf of gray, high or valley stock (no drow). Any alignment. No multi-classing.</li>
    <li><strong>Preferred weapons</strong> are learned before any others: any lance, any sword but the short sword and khopesh, scimitar, horseman's mace, flail and pick, dagger, hand axe, javelin, bec de corbin${elfish ? ", and (for elves and half-elves) short bow or short composite bow" : ""}.</li>
    <li><strong>Armor:</strong> no leather, studded leather or padded armor and no wooden shield. Wears the heaviest armor in large battles.</li>
    <li><strong>Kept from UA:</strong> experience, hit dice and titles; immunity to fear; lance damage bonuses; parrying; saddle chances; horse value; henchmen limits (UA p.75).</li>
    <li><strong>Removed:</strong> 90% mind resistance, +2 vs. illusions, the fear aura, fighting at negative hit points (unconscious at 0 to −9, dead at −10), ability score increases, alignment rules, zero-level horseman and lancer, charging every foe in sight, the extra 3 hit points at 1st level.</li>
    <li><strong>Training:</strong> to 9th level, by a cavalier at least two levels higher, at normal fees.</li>
    <li><strong>Hospitality:</strong> none from other cavaliers until the cavalier holds land.</li>
    <li><strong>BATTLESYSTEM:</strong> +1 to command radius; units led get +1 Discipline Rating and −1 on rally attempts.</li>
    ${later.map(([lv, t]) => `<li class="${L >= lv ? "" : "cv-later"}">${L >= lv ? "" : `<em>From ${CV.ord(lv)} level:</em> `}${t}</li>`).join("")}
  </ul>`));
  return out.join("");
}

/** Roll the starting gold for the social class entered on the tab and post it. */
export async function rollFunds(actor) {
  const social = actor.getFlag?.(MID, "social");
  const f = CV.fundsFor(social);
  if (!f) { ui.notifications.warn("Enter a social class roll of 56 or more first."); return null; }
  const roll = await new Roll(f[2]).evaluate();
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), rolls: [roll],
    content: `<div class="frpg1e-card"><header class="card-head"><div><div class="card-title">${esc(actor.name)}: starting funds</div><div class="card-sub">Cavalier (Dragon #148), social class ${social}: ${esc(f[3])}</div></div></header><div class="roll-line"><span class="adnd-big">${roll.total}</span> <strong>gp</strong></div></div>` });
}
