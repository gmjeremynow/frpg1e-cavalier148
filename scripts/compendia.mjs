/** World compendium built from the module's JSON (same approach as the system: no compiled LevelDB packs). */
const MID = "frpg1e-cavalier148";
export const DATA_VERSION = "2";
const PACK = { name: "cavalier148-rules", label: "Corrected Cavalier (Dragon #148)", file: "journals.json", type: "JournalEntry" };

export async function offerImport() {
  if (game.settings.get(MID, "compendiaVersion") === DATA_VERSION) return;
  const ok = await foundry.applications.api.DialogV2.confirm({
    window: { title: "Corrected Cavalier: Compendium" },
    content: "<p>Create the Corrected Cavalier world compendium (the class rules from Dragon #148 in plain words)?</p><p class=\"hint\">You can do this later from Game Settings → Configure Settings → Corrected Cavalier.</p>",
    rejectClose: false
  });
  if (ok) await importCompendia();
  else await game.settings.set(MID, "compendiaVersion", DATA_VERSION);
}

export async function importCompendia({ confirm = false } = {}) {
  if (!game.user.isGM) return;
  if (confirm) {
    const ok = await foundry.applications.api.DialogV2.confirm({ window: { title: "Rebuild the Corrected Cavalier Compendium" },
      content: "<p>Rebuild the Corrected Cavalier compendium? The existing copy in this world is replaced.</p>", rejectClose: false });
    if (!ok) return;
  }
  const data = await (await fetch(`modules/${MID}/data/${PACK.file}`)).json();
  const existing = game.packs.get(`world.${PACK.name}`);
  if (existing) await existing.deleteCompendium();
  const pack = await foundry.documents.collections.CompendiumCollection.createCompendium({ name: PACK.name, label: PACK.label, type: PACK.type });
  await JournalEntry.createDocuments(data, { pack: pack.collection });
  ui.notifications.info(`${PACK.label}: ${data.length} journal entr${data.length === 1 ? "y" : "ies"}.`);
  await game.settings.set(MID, "compendiaVersion", DATA_VERSION);
}
