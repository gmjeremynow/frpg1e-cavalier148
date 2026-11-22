/**
 * The corrected cavalier (David Howery, "The Corrected Cavalier", Dragon #148, p.30-32).
 * Pure data and functions, no Foundry calls, so the tests can load it directly.
 */
export const KEY = "cavalier148";
export const SRC = "Dragon #148 p.30-32";

export const MINIMUMS = { str: 13, con: 13, cha: 13 };
export const MIN_SOCIAL = 56;
/** Elves and half-elves of gray, high or valley stock; no drow. */
export function raceAllowed(race) {
  const r = String(race ?? "");
  if (!r || r === "human") return true;
  const m = r.match(/^(half-elf|elf)(?:-(\w+))?$/);
  if (!m) return false;
  const sub = m[2] ?? "high";   // the plain elf and half-elf entries are high elf (descent)
  return ["gray", "high", "valley"].includes(sub);
}
/** Weapons of choice: +1 to hit, +2 mounted. */
export const choiceHit = (choice, level, mounted) => (["lance", "sword", "horseman"].includes(choice) ? (mounted ? 2 : 1) : 0);
/** Attacks per round with weapons of choice: 3/2 at 1-6, 2/1 at 7-12, 5/2 at 13+. */
export const choiceAttacks = level => (level >= 13 ? "5/2" : level >= 7 ? "2/1" : "3/2");
/** Other weapons as a fighter: 1/1, 3/2 at 7-12, 2/1 at 13+. */
export const OTHER_ATTACKS = [[6, "1/1"], [12, "3/2"], [null, "2/1"]];
/** Starting funds by social class roll (Dragon #148 p.32). */
export const FUNDS = [[56, 87, "5d4 * 10", "50-200 gp (5d4 × 10)"], [88, 96, "(1d12 + 8) * 10", "90-200 gp ([1d12 + 8] × 10)"],
  [97, 99, "1d100 + 100", "101-200 gp (1d100 + 100)"], [100, 100, "5d10 + 150", "155-200 gp (5d10 + 150)"]];
export const fundsFor = roll => FUNDS.find(([a, b]) => roll >= a && roll <= b) ?? null;
/** Preferred weapons (must be learned before any others), by the system's weapon names. */
export const PREFERRED = ["Lance (heavy horse)", "Lance (light horse)", "Lance (medium horse)", "Sword, Bastard", "Sword, Broad", "Sword, Falchion", "Sword, Long",
  "Sword, Two-handed", "Scimitar", "Mace, Horseman’s", "Flail, Horseman’s", "Pick, Military, Horseman’s", "Dagger", "Axe, Hand", "Javelin", "Bec de Corbin"];
export const ELF_BOWS = ["Bow, Short", "Bow, Composite, Short"];
/** Armor a cavalier will not use. */
export const BANNED_ARMOR = ["Leather armor", "Studded leather", "Padded armor", "Shield, small, wooden"];
export const UA_XP = [0, 2501, 5001, 10001, 18501, 37001, 85001, 140001, 220001, 300001, 600001, 900001];

/** The class definition for game.frpg1e.api.registerClass. mountedLevel is read from a world setting. */
export function classDef(mountedLevel = () => true) {
  return {
    label: "Cavalier (corrected, Dragon #148)", source: "Dragon #148", src: "Dragon #148",
    hitDie: 10, firstDice: 1, maxHD: 10, afterHP: 3, matrix: "fighter", save: "fighter",
    fighterCon: true, exceptionalStr: true, nonProf: -3, cavalier: true,
    attacksPerRound: OTHER_ATTACKS,
    profSlots: [3, 2, 1, 1, 3],
    xp: UA_XP, xpStep: 300000,
    cavalierRules: {
      mindResist: false, illusionSave: 0, goodAura: false, ridingSkills: false,
      get mountedLevel() { return !!mountedLevel(); },
      choiceHit, choiceAttacks,
      choiceLabel: () => "Weapon of choice +1 (+2 mounted)",
      extraRows: () => [{ label: "Parry", value: "Shield or hand weapon (UA)" }],
      notes: () => ["Riding (nonweapon proficiency, horses) replaces the UA riding progression; the saddle chances above are unchanged.",
        "Corrected cavalier (Dragon #148): no mind resistance, no illusion bonus, no fear aura, no negative hit points."]
    }
  };
}

/** 1 -> "1st". */
export const ord = n => `${n}${[, "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] ?? "th"}`;
