# Corrected Cavalier (Dragon #148) for 1e FRPG, v0.2.0

An optional class module for the 1e FRPG system for Foundry VTT (system 0.34.0 or later). It adds a cavalier that is a subclass of the fighter: it keeps the Unearthed Arcana cavalier's weapons of choice, riding, fear immunity and lance bonuses, and drops the powers the article judged too strong. Turn the module on or off in Manage Modules.

Based on David Howery's article "The Corrected Cavalier" (Dragon #148, August 1989, p.30-32). The rules are restated in plain words; the numbers (attacks per round, proficiency slots, starting funds, followers) follow the article. You need the article for its original text.

## Install

In Foundry's Setup screen, go to Add-on Modules, Install Module, and paste this manifest URL:

`https://github.com/gmjeremynow/frpg1e-cavalier148/releases/latest/download/module.json`

## What it adds

- The class "Cavalier (corrected, Dragon #148)": the UA cavalier's experience table and hit dice without the extra 3 hit points at 1st level, the fighter's attack and saving throw tables, −3 when not proficient, and 3 weapon and 2 nonweapon slots at 1st level with one more of each every three levels.
- Weapons of choice, marked on each weapon's sheet: +1 to hit, or +2 when Mounted is ticked. Attacks per round are 3/2 at 1st-6th level, 2/1 at 7th-12th and 5/2 from 13th; other weapons get 1/1, 3/2 and 2/1.
- The Cavalier Abilities box keeps the saddle chance and fear immunity, and leaves out the 90% mind resistance, the +2 against illusions, the fear aura, negative hit points and the UA riding progression.
- A Cavalier tab: attacks per round, proficiency slots, the social class roll with a starting funds roll, and the rules to remember.
- Record tab notes, which never block anything: strength, constitution or charisma under 13; a race other than human, or elf or half-elf of gray, high or valley stock; more than one class; leather, studded leather or padded armor, or a wooden shield, worn.
- A compendium with the class rules restated in plain words.

## Settings

- **Corrected cavalier only:** hides the UA cavalier and the UA paladin, since the article plays paladins from the Players Handbook.
- **Human cavaliers attack as 1 level higher when mounted** (on by default): this is a UA rule (p.15), found under mounted combat and horsemanship. The article deletes the UA mounted combat bonuses for weapons of choice but does not mention this rule, so it is left to you.

## Choices made here

- The article does not give a penalty for using a weapon without proficiency. The module keeps the UA cavalier's −3 rather than the fighter's −2.
- The article adds slots "every three levels beyond 1st (4th, 9th, etc.)". 9th does not fit every three levels, so the module uses 4th, 7th, 10th and so on.
- Not handled automatically: social class beyond the funds table, training, followers, hospitality, the pennon and the BATTLESYSTEM bonuses (all described in the tab and the compendium), and learning the preferred weapons before any others.
