# Prompt: Text-Based Murder Mystery Website (Birthday Edition)

Use this as a build brief — paste it into Claude, Claude Code, or any AI coding tool to generate the actual website.

---

## 1. Project Summary

Build a single-page, text-based murder mystery game as a birthday gift website. The player explores a crime scene, gathers clues, and interrogates suspects through dialogue, then submits a final multiple-choice accusation (suspect + weapon + motive). Total playtime: **~1 hour**.

## 2. Core Gameplay Mechanics

- **Investigation phase:** Player navigates between 4–6 locations (e.g. study, garden, kitchen, victim's bedroom). Each location has 2–4 clickable clues (objects, notes, photos) that reveal text/evidence when examined.
- **Interrogation phase:** Player can talk to 4–5 suspects. Each suspect has a branching dialogue tree:
  - An opening statement/alibi.
  - 2–3 follow-up questions the player can ask (multiple choice).
  - Suspects react differently if the player has already found clues that contradict their alibi — dialogue should unlock new lines once specific evidence has been collected (a simple flag system: `hasClue_bloodyGlove`, `hasClue_will`, etc.).
- **Clue log:** A persistent sidebar or tab showing all clues and dialogue snippets collected so far, so the player doesn't have to remember everything.
- **Progression gating:** Some locations/suspects unlock only after certain clues are found, to pace the ~1 hour experience across a few acts (e.g. Act 1: initial scene, Act 2: interrogations, Act 3: final confrontation/reveal).
- **Final accusation:** A multiple-choice screen: pick the killer, the weapon, and the motive from lists of the suspects/weapons/motives introduced during the game. Getting it right/wrong should lead to a distinct narrated ending (a "correct" full reveal scene vs a "wrong guess" scene that still reveals the truth so she isn't left hanging).
- **Hint system (optional but recommended):** A subtle "hint" button that nudges her toward an unexamined clue or unasked question if she gets stuck, without giving away the answer.

## 3. Content to Prepare (fill in before building)

- Victim: name, role, how/where they died.
- 4–5 suspects: name, relationship to victim, public alibi, hidden secret/motive.
- The real killer, weapon, and motive.
- 10–15 clues distributed across locations, each pointing toward or away from suspects (include red herrings).
- Setting/theme (mansion, cruise ship, office party, etc.) — ideally tied to something she loves (a favorite show's aesthetic, a shared inside joke, a place you've been together).
- Personalized touches: her name as the "detective," in-jokes worked into suspect names or clue flavor text, a birthday message unlocked at the end.

## 4. Website Structure

- Single HTML page (or lightweight multi-view SPA), mobile-friendly.
- Screens: Title/intro → Investigation hub (location map or tabs) → Location detail (clues) → Suspect dialogue → Clue log (always accessible) → Final accusation → Ending/reveal → Birthday message.
- Save progress in memory during the session (no login needed); a "restart" option is fine.

## 5. Tone & Style

- Atmospheric but not gory — playful noir/whodunit tone appropriate for a birthday gift, not genuinely upsetting content.
- Include her name and warm, personal touches, especially in the final reveal/birthday message.
- Visual style: dark, moody color palette (deep purples/reds/gold accents), typewriter or serif font for a detective-novel feel, subtle animations on clue reveal.

## 6. Technical Notes

- Build as a single HTML file with embedded CSS/JS (or React if more interactivity is needed) so it's easy to share as one file or host anywhere.
- Keep all game data (suspects, clues, dialogue trees) in a clearly structured JS object at the top of the file, so it's easy to edit/expand later.
- No backend required — everything runs client-side.

---

**Next step:** Fill in Section 3 (victim, suspects, clues, killer/weapon/motive, personal touches), then hand this whole document back to me and I'll build the actual website.
