/**
 * Corrected Cavalier (Dragon #148) for 1e FRPG (Table Edition). An optional add-on: enable or disable it in Manage Modules.
 * Registers the cavalier from "The Corrected Cavalier" (David Howery, Dragon #148, August 1989), adds a Cavalier tab
 * to character and NPC sheets, and builds a world compendium with the class rules in plain words.
 */
import * as CV from "./rules.mjs";
import { renderCavalierTab, rollFunds } from "./sheet-tab.mjs";
import { offerImport, importCompendia } from "./compendia.mjs";

export const MID = "frpg1e-cavalier148";
let API = null;
const setting = (k, d) => { try { return game.settings.get(MID, k); } catch { return d; } };

Hooks.once("frpg1e.init", api => {
  API = api;
  if (!api.hideClasses) { console.error(`${MID} | needs 1e FRPG 0.34.0 or later`); return; }
  api.registerClass(CV.KEY, CV.classDef(() => setting("mountedLevel", true)));
});

Hooks.once("init", () => {
  game.settings.register(MID, "hideUA", { name: "Corrected cavalier only", scope: "world", config: true, type: Boolean, default: false,
    hint: "Takes the UA cavalier and the UA paladin out of the class list (the article keeps the PHB paladin). Characters already using them keep them.",
    onChange: v => applyLists(v), requiresReload: false });
  game.settings.register(MID, "mountedLevel", { name: "Human cavaliers attack as 1 level higher when mounted", scope: "world", config: true, type: Boolean, default: true,
    hint: "A UA rule (p.15). The article deletes the UA mounted rules for weapons of choice but does not name this one; turn it off if you read it as removed.",
    requiresReload: false });
  game.settings.register(MID, "compendiaVersion", { scope: "world", config: false, type: String, default: "" });
  game.settings.registerMenu(MID, "rebuild", { name: "Corrected cavalier compendium", label: "Rebuild the corrected cavalier compendium", icon: "fa-solid fa-book",
    type: class extends foundry.applications.api.ApplicationV2 { render() { importCompendia({ confirm: true }); return this; } }, restricted: true });
  game.cavalier148 = { rollFunds, importCompendia, rules: CV };
});

Hooks.once("setup", () => applyLists(setting("hideUA", false)));
Hooks.once("ready", () => {
  if (!API?.hideClasses) ui.notifications.error("Corrected Cavalier needs 1e FRPG (Table Edition) 0.34.0 or later.", { permanent: true });
  else if (game.user.isGM) offerImport();
});

function applyLists(hide) {
  const api = game.frpg1e?.api;
  if (!api?.hideClasses) return;
  if (hide) api.hideClasses(["cavalier", "paladinUA"]); else api.showClasses(["cavalier", "paladinUA"]);
  for (const a of game.actors ?? []) if (["character", "npc"].includes(a.type)) a.sheet?.rendered && a.sheet.render();
}

/** Requirement notes on the Record tab. Nothing here changes the numbers. */
export function prepareCavalier(sys, items = []) {
  const classes = sys.classInfo ?? [];
  const cav = classes.find(c => c.key === CV.KEY);
  if (!cav) return;
  const notes = sys.settingNotes ?? (sys.settingNotes = []);
  const T = "Cavalier (Dragon #148)";
  const ab = sys.abilities ?? {};
  const low = Object.entries(CV.MINIMUMS).filter(([k, m]) => (ab[k]?.value ?? 0) < m).map(([k, m]) => `${k.toUpperCase()} ${m}`);
  if (low.length) notes.push(`${T}: below the minimum ability scores (${low.join(", ")}).`);
  const race = sys.details?.race;
  if (race && !CV.raceAllowed(race)) notes.push(`${T}: only humans, and elves or half-elves of gray, high or valley elf stock (no drow).`);
  if (classes.length > 1) notes.push(`${T}: cavaliers cannot be multi-classed.`);
  const list = Array.isArray(items) ? items : [...(items ?? [])];
  for (const a of list.filter(i => i.type === "armor" && i.system?.equipped))
    if (CV.BANNED_ARMOR.includes(a.name)) notes.push(`${T}: ${a.name} is not used (no leather, studded leather or padded armor, no wooden shield).`);
}
Hooks.on("frpg1e.prepareCharacter", (sys, items) => prepareCavalier(sys, items));
Hooks.on("renderCharacterSheet", (app, element) => renderCavalierTab(app, element));
