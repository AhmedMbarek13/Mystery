export type Act = 1 | 2 | 3;

export type Location = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  act: Act;
  unlockClue?: string;
  accent: string;
};

export type Clue = {
  id: string;
  title: string;
  locationId: string;
  category: string;
  summary: string;
  detail: string;
  implication: string;
  act: Act;
  unlockClue?: string;
};

export type Suspect = {
  id: string;
  name: string;
  epithet: string;
  role: string;
  alibi: string;
  portrait: string;
  opening: string;
  questions: Array<{
    id: string;
    label: string;
    response: string;
    reveals?: string;
  }>;
};

export const locations: Location[] = [
  {
    id: "study",
    name: "Elias's Study",
    subtitle: "The locked room",
    description: "A room arranged like a stage after the curtain has fallen. Rain threads the tall windows. The desk lamp burns without warmth.",
    act: 1,
    accent: "crimson",
  },
  {
    id: "library",
    name: "The Library",
    subtitle: "Archives of the forgotten",
    description: "Dusty shelves rise toward a painted ceiling. Somewhere behind the books, a mechanism waits for the right question.",
    act: 1,
    unlockClue: "phone-message",
    accent: "gold",
  },
  {
    id: "ballroom",
    name: "The Ballroom",
    subtitle: "A party frozen mid-breath",
    description: "The orchestra has stopped. Six place settings remain beneath a chandelier that sways whenever thunder speaks.",
    act: 2,
    unlockClue: "archive-proof",
    accent: "rose",
  },
  {
    id: "greenhouse",
    name: "The Greenhouse",
    subtitle: "Glass, vines, and black soil",
    description: "Condensation blurs the glass. The flowers are overwatered, as if someone has been tending them in a hurry.",
    act: 2,
    unlockClue: "hidden-room",
    accent: "emerald",
  },
  {
    id: "west-wing",
    name: "The West Wing",
    subtitle: "Where the power failed",
    description: "The corridor smells of wet stone and old electricity. A service door hangs open at the end of the hall.",
    act: 2,
    unlockClue: "outage-record",
    accent: "blue",
  },
  {
    id: "underground",
    name: "Below the Greenhouse",
    subtitle: "The room Elias hid",
    description: "A narrow stair descends beneath the roots. The air is colder here, and every sound seems to arrive late.",
    act: 3,
    unlockClue: "underground-chamber",
    accent: "violet",
  },
];

export const clues: Clue[] = [
  {
    id: "pocket-watch",
    title: "The stopped pocket watch",
    locationId: "study",
    category: "Timeline",
    summary: "A silver watch stopped at 23:41.",
    detail: "The glass is unbroken. The hands were turned and the mechanism halted by a careful thumb. It is a timestamp dressed as evidence.",
    implication: "Someone wanted the room to tell a lie about when Elias died.",
    act: 1,
  },
  {
    id: "wine-glass",
    title: "Two fingerprints on red wine",
    locationId: "study",
    category: "Physical evidence",
    summary: "The wine is clean. The glass is not.",
    detail: "There is no poison in the remaining wine, but two sets of prints overlap around the stem. One belongs to Elias. The other has been partially wiped.",
    implication: "The glass changed hands before anyone found the body.",
    act: 1,
  },
  {
    id: "blood-message",
    title: "A message in blood",
    locationId: "study",
    category: "Statement",
    summary: "SHE DESERVED TO LIVE.",
    detail: "The blood is not Elias's. The lettering is uneven, written with a fingertip or a narrow tool. It reads like an accusation and a plea at once.",
    implication: "The murder is still orbiting Elise Vermeer.",
    act: 1,
  },
  {
    id: "birthday-candle",
    title: "The extinguished candle",
    locationId: "study",
    category: "Symbol",
    summary: "Six candles. One marked ELISE has gone dark.",
    detail: "The cake was untouched except for one candle. Someone carved ELISE into the wax before the party began.",
    implication: "Someone came here remembering the dead, not celebrating the living.",
    act: 1,
  },
  {
    id: "phone-message",
    title: "The message at 23:17",
    locationId: "study",
    category: "Correspondence",
    summary: "You don't have to forgive me. You only have to understand.",
    detail: "Elias sent the message to an unknown number. The thread contains no reply, only a deleted attachment whose thumbnail shows a dark stairwell.",
    implication: "Elias expected someone to come to him tonight.",
    act: 1,
  },
  {
    id: "archive-proof",
    title: "Elise died inside",
    locationId: "library",
    category: "Archive",
    summary: "Elias's private notes contradict the police report.",
    detail: "A floor plan is marked with a red X in the west wing. Beside it, Elias wrote: Not outside. Never outside. The official report was built on a lie.",
    implication: "The original investigation protected the house, not Elise.",
    act: 2,
  },
  {
    id: "hidden-room",
    title: "The room behind the books",
    locationId: "library",
    category: "Discovery",
    summary: "Hundreds of photographs watch the six guests.",
    detail: "Elias photographed every suspect for months. On the wall: SIX PEOPLE ENTERED THE HOUSE THAT NIGHT. ONLY FIVE LEFT.",
    implication: "Elias was not investigating a cold case. He was preparing a reckoning.",
    act: 2,
  },
  {
    id: "outage-record",
    title: "The altered outage log",
    locationId: "west-wing",
    category: "Timeline",
    summary: "The power failed at 23:23, not 23:00.",
    detail: "A maintenance duplicate preserves the original time beneath a forged report. The blackout was moved earlier to hide the final minutes of Elise's life.",
    implication: "Someone with access to police records edited the past.",
    act: 2,
  },
  {
    id: "vincent-case",
    title: "The missing ampoule",
    locationId: "ballroom",
    category: "Medical",
    summary: "One vial is absent from Halo's emergency case.",
    detail: "The inventory is precise, almost obsessive. One ampoule of cardiac toxin is gone. Halo insists he never opened the case tonight.",
    implication: "The poison points at Halo, but the empty space points to whoever could reach him.",
    act: 2,
  },
  {
    id: "elise-recording",
    title: "Elise's last recording",
    locationId: "west-wing",
    category: "Audio",
    summary: "If something happens to me, it wasn't an accident.",
    detail: "The recording ends after Elise whispers: Elias knows. Her voice is followed by a door, a fall, and six seconds of silence.",
    implication: "Elias knew the truth for eight years and chose what to do with it.",
    act: 2,
    unlockClue: "underground-chamber",
  },
  {
    id: "medical-report",
    title: "Three months",
    locationId: "ballroom",
    category: "Medical",
    summary: "Elias was already dying.",
    detail: "Halo's concealed report gives Elias approximately three months to live. The poison did not begin the story of his death; it changed its ending.",
    implication: "The difference between murder and mercy will not be easy to measure.",
    act: 2,
  },
  {
    id: "underground-chamber",
    title: "The coffin beneath the roots",
    locationId: "underground",
    category: "The truth",
    summary: "Elise Vermeer was never missing.",
    detail: "A sealed chamber holds Elise, preserved for eight years. A camera on the wall points toward the coffin, not away from it.",
    implication: "Elias did not only hide the truth. He kept it where he could look at it.",
    act: 3,
  },
  {
    id: "evidence-video",
    title: "Elias's final film",
    locationId: "underground",
    category: "Confession",
    summary: "If you're watching this, someone finally did what I couldn't.",
    detail: "Elias looks into the lens. I built a game because the truth needed a witness. Find Elise. Then decide what to do with everyone who helped me bury her.",
    implication: "The accusation is not the end of the case. It is the player's moral choice.",
    act: 3,
  },
];

export const suspects: Suspect[] = [
  {
    id: "fardau",
    name: "Fardau",
    epithet: "The woman who stayed",
    role: "Literature student",
    alibi: "She was in the garden when the lights failed, listening to music through one earbud.",
    portrait: "FD",
    opening: "Fardau sits with both hands around a cold cup of tea. She says she came because Elias promised to show everyone what happened to Elise. She says she did not believe him.",
    questions: [
      { id: "elise", label: "You barely knew Elise?", response: "That is what I said. It is also what Elias wanted everyone to believe.", reveals: "Fardau knew Elise was frightened that night." },
      { id: "garden", label: "Why were you really in the garden?", response: "Because some houses make it easier to breathe outside them. Do not mistake that for an alibi.", reveals: "Her timeline leaves eleven unaccounted minutes." },
      { id: "music", label: "What were you listening to outside?", response: "A song my mother used to play when she was afraid. It has a chorus you cannot translate without losing something.", reveals: "Fardau carries a private grief she will not name." },
      { id: "threat", label: "What did Elias threaten to reveal?", response: "He collected secrets as if they were stamps. Mine was the one he kept closest to his chest.", reveals: "Elias had leverage over Fardau before tonight." },
    ],
  },
  {
    id: "leo",
    name: "Leo",
    epithet: "The brother",
    role: "Heir to Luna Manor",
    alibi: "He argued with Elias, then claims he returned to the ballroom before the blackout.",
    portrait: "JV",
    opening: "Leo adjusts his cufflinks before he answers. He speaks of Elias as a difficult brother, never as a dead man. His version of the evening is polished enough to have been rehearsed.",
    questions: [
      { id: "argument", label: "Was it really a five-minute argument?", response: "Time behaves strangely when one is being accused. Forty-three minutes is an ugly exaggeration.", reveals: "Leo was the last person to see Elias alive in the study." },
      { id: "stairs", label: "What happened to Elise on the stairs?", response: "You have been listening to ghosts. Ghosts are very persuasive in this house.", reveals: "Leo recognizes the west-wing floor plan too quickly." },
      { id: "estate", label: "Were you selling pieces of the estate?", response: "A house this large is an expensive corpse. Elias understood that before I did.", reveals: "Leo had a financial reason to fear Elias's investigation." },
      { id: "last-seen", label: "What did Elias say when you left?", response: "He asked whether I remembered the sound a body makes when it meets stone. I told him to stop being theatrical.", reveals: "Elias was provoking Leo with the old case." },
    ],
  },
  {
    id: "odin",
    name: "Odin",
    epithet: "The detective",
    role: "Former police investigator",
    alibi: "He was checking the security panel when the outage began.",
    portrait: "MD",
    opening: "Odin does not sit. He stands near the door with the posture of someone who has spent years arriving too late. When you mention the old case, he asks whether you want facts or absolution.",
    questions: [
      { id: "report", label: "Why was the report altered?", response: "Because I believed a family could survive one terrible lie. I was wrong about both parts.", reveals: "Odin admits the official timeline was falsified." },
      { id: "ambulance", label: "Did you call an ambulance for Elise?", response: "I reached for the phone. Elias put his hand over mine. That is the moment I remember every morning.", reveals: "Odin was present while Elise was still alive." },
      { id: "power", label: "Who changed the outage time?", response: "Someone with a key, a uniform, and enough shame to mistake paperwork for a time machine.", reveals: "Odin knows exactly how the record was falsified." },
      { id: "evidence", label: "What did Elias have on you?", response: "Proof that I chose a family name over a girl's last chance. He called it evidence. I call it the thing that followed me home.", reveals: "Elias used Odin's guilt to control him." },
    ],
  },
  {
    id: "halo",
    name: "Halo",
    epithet: "The doctor",
    role: "Elias's physician",
    alibi: "He was in the ballroom, watching the candles gutter in the draft.",
    portrait: "VL",
    opening: "Halo keeps his medical case closed on his lap. His voice is calm, but he checks the clasps every time thunder shakes the windows. He has already decided what he can afford to admit.",
    questions: [
      { id: "health", label: "How long did Elias have?", response: "Three months, perhaps less. He asked me to keep the report private. I mistook secrecy for care.", reveals: "Elias was already dying." },
      { id: "poison", label: "Who could access your case?", response: "Anyone who knew I would be distracted by a body. Anyone who knew I would be blamed first.", reveals: "The missing toxin does not prove Halo used it." },
      { id: "dose", label: "What would the poison do?", response: "Slowly, if diluted. Quickly, if someone wanted to make a dying man look murdered. I will not pretend the distinction comforts me.", reveals: "The poison could accelerate Elias's death without causing it outright." },
      { id: "promise", label: "Why protect Elias's diagnosis?", response: "He paid me in silence. I told myself privacy was a form of medicine. That was a convenient lie.", reveals: "Halo concealed Elias's condition from everyone." },
    ],
  },
];

export const endingCopy = {
  justice: {
    title: "Justice",
    kicker: "Murder is murder.",
    body: "You accuse Halo. When the road clears, the police find a confession waiting in Elias's archive. Odin and Leo finally speak. Fardau gives her testimony. Elise is named in the light at last.",
    closing: "You solved the murder. But justice is not the same thing as forgiveness.",
  },
  mercy: {
    title: "Mercy",
    kicker: "Some crimes cannot be answered with justice.",
    body: "You protect Halo. Before dawn, he is gone. Elias's recordings become public, and the others face the consequences they postponed for eight years. The truth survives, even without a clean verdict.",
    closing: "Perhaps she deserved mercy. Perhaps Elise did too. Perhaps justice is not something we are qualified to decide.",
  },
  truth: {
    title: "The Truth",
    kicker: "Everyone who helped bury Elise is guilty.",
    body: "You expose everyone: Leo, Odin, Elias, Fardau, and Halo. No one gets to hide behind another person's crime. The conspiracy becomes larger than the murder, and finally impossible to conceal.",
    closing: "You did not solve a murder. You solved a conspiracy.",
  },
  true: {
    title: "The Unwritten Ending",
    kicker: "You found the liar.",
    body: "You reconstruct the impossible time: Elias died around 23:32, before Halo's poison could have done what the evidence claims. Halo poisoned him, then built a trail toward Fardau. He was protecting the truth that Elise was his sister.",
    closing: "Sometimes the person who leaves the clues is not asking to be saved. They are asking to be seen.",
  },
};
