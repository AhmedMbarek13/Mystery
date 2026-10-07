"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clues,
  endingCopy,
  locations,
  suspects,
  type Clue,
  type Suspect,
} from "@/data/mystery";

type Screen = "intro" | "investigate" | "location" | "interrogate" | "journal" | "accuse" | "ending";
type EndingKey = keyof typeof endingCopy;

type SavedGame = {
  collectedClues: string[];
  askedQuestions: string[];
  completedIntro: boolean;
};

const STORAGE_KEY = "lunas-mansion-progress";

function readSavedGame(): SavedGame | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as SavedGame;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function getAct(collectedClues: string[]) {
  if (collectedClues.includes("evidence-video")) return 3;
  if (collectedClues.includes("archive-proof")) return 2;
  return 1;
}

function getPressureLine(suspectId: string, collectedClues: string[]) {
  const pressureLines: Record<string, { clue: string; text: string }> = {
    fardau: { clue: "blood-message", text: "The words on the wall mention someone who deserved to live. Fardau stops looking at you when you say Elise's name." },
    leo: { clue: "pocket-watch", text: "The false time leaves Leo less room to hide. He asks who told you about the watch." },
    odin: { clue: "outage-record", text: "The original outage log makes Odin's old report impossible to defend." },
    halo: { clue: "vincent-case", text: "The missing ampoule is no longer an abstract suspicion. Halo asks whether the vial was found." },
  };
  const pressure = pressureLines[suspectId];
  return pressure && collectedClues.includes(pressure.clue) ? pressure.text : null;
}

type ConversationPrompt = {
  id: string;
  label: string;
  response: string;
  reveals?: string;
};

const questionUnlocks: Record<string, string> = {
  "fardau:garden": "birthday-candle",
  "fardau:music": "phone-message",
  "fardau:threat": "blood-message",
  "leo:stairs": "archive-proof",
  "leo:estate": "pocket-watch",
  "leo:last-seen": "phone-message",
  "odin:ambulance": "archive-proof",
  "odin:power": "outage-record",
  "odin:evidence": "elise-recording",
  "halo:poison": "vincent-case",
  "halo:dose": "medical-report",
  "halo:promise": "phone-message",
};

function getEvidencePrompt(suspectId: string, collectedClues: string[]): (ConversationPrompt & { clue: string }) | null {
  const evidencePrompts: Record<string, { clue: string; label: string; response: string; reveals: string }> = {
    fardau: { clue: "blood-message", label: "What do you know about the words on the wall?", response: "Those words were not written for Elias. They were written for the girl he left where nobody would look.", reveals: "Fardau reacts to the blood message as if she knows who wrote it." },
    leo: { clue: "pocket-watch", label: "Who stopped the pocket watch?", response: "A person who needed the house to remember the wrong minute. You should ask who benefits from a clean timeline.", reveals: "Leo refuses to say whether he touched the watch." },
    odin: { clue: "outage-record", label: "Why does the outage log contradict your report?", response: "Because I changed it. There. The lie is smaller when spoken aloud, but it does not become less ugly.", reveals: "Odin directly admits altering the official timeline." },
    halo: { clue: "vincent-case", label: "What can you tell me about the missing ampoule?", response: "Enough to know it was diluted before it was used. Whoever took it understood that a dying man can be made to look murdered.", reveals: "Halo believes the toxin was stolen to confuse the cause of death." },
  };
  const prompt = evidencePrompts[suspectId];
  return prompt && collectedClues.includes(prompt.clue) ? { ...prompt, id: `evidence:${prompt.clue}` } : null;
}

function DialoguePanel({ suspect, collectedClues, askedQuestions, onAsk }: { suspect: Suspect; collectedClues: string[]; askedQuestions: string[]; onAsk: (questionId: string) => void }) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const evidencePrompt = getEvidencePrompt(suspect.id, collectedClues);
  const prompts: ConversationPrompt[] = evidencePrompt ? [...suspect.questions, evidencePrompt] : suspect.questions;
  const activePrompt = prompts.find((prompt) => prompt.id === activeQuestionId);
  const availablePrompts = prompts.filter((prompt) => !askedQuestions.includes(`${suspect.id}:${prompt.id}`) && (!questionUnlocks[`${suspect.id}:${prompt.id}`] || collectedClues.includes(questionUnlocks[`${suspect.id}:${prompt.id}`])));
  const waitingForEvidence = prompts.some((prompt) => questionUnlocks[`${suspect.id}:${prompt.id}`] && !collectedClues.includes(questionUnlocks[`${suspect.id}:${prompt.id}`]) && !askedQuestions.includes(`${suspect.id}:${prompt.id}`));

  function choosePrompt(prompt: ConversationPrompt) {
    onAsk(prompt.id);
    setActiveQuestionId(prompt.id);
  }

  return (
    <article className="interview-panel">
      <div className="interview-heading"><span className="portrait large">{suspect.portrait}</span><div><p className="eyebrow">{suspect.role}</p><h2>{suspect.name}</h2><p>{suspect.alibi}</p></div></div>
      <div className="opening-statement"><span className="eyebrow">Opening statement</span><p>{suspect.opening}</p></div>
      {getPressureLine(suspect.id, collectedClues) && <div className="pressure-note"><span>Evidence changes the room</span><p>{getPressureLine(suspect.id, collectedClues)}</p></div>}
      {activePrompt && <div className="conversation-turn" key={activePrompt.id}><div className="player-line"><span>You</span><p>{activePrompt.label}</p></div><div className="suspect-line"><span>{suspect.name}</span><p>{activePrompt.response}</p>{activePrompt.reveals && <small>Journal note: {activePrompt.reveals}</small>}</div></div>}
      <div className="question-list"><span className="eyebrow">{activePrompt ? "Ask something else" : "Choose a question"}</span>{availablePrompts.length ? availablePrompts.map((prompt) => <button className="question-choice" key={prompt.id} onClick={() => choosePrompt(prompt)}><span>+</span><strong>{prompt.label}</strong><small>{prompt.id.startsWith("evidence:") ? "Ask about evidence" : "Ask this question"}</small></button>) : <p className="conversation-complete">They have nothing more to say. For now.</p>}{waitingForEvidence && <p className="evidence-waiting">More questions will surface when the evidence gives you something new to ask.</p>}</div>
    </article>
  );
}

export default function MansionGame() {
  const savedGame = readSavedGame();
  const [screen, setScreen] = useState<Screen>(savedGame?.completedIntro ? "investigate" : "intro");
  const [selectedLocation, setSelectedLocation] = useState<string>("study");
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [collectedClues, setCollectedClues] = useState<string[]>(savedGame?.collectedClues ?? []);
  const [askedQuestions, setAskedQuestions] = useState<string[]>(savedGame?.askedQuestions ?? []);
  const [ending, setEnding] = useState<EndingKey | null>(null);
  const [accusation, setAccusation] = useState({ killer: "", weapon: "", motive: "" });
  const [hintText, setHintText] = useState<string | null>(null);

  useEffect(() => {
    const saved: SavedGame = {
      collectedClues,
      askedQuestions,
      completedIntro: screen !== "intro",
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [askedQuestions, collectedClues, screen]);

  const act = getAct(collectedClues);
  const discovered = useMemo(
    () => clues.filter((clue) => collectedClues.includes(clue.id)),
    [collectedClues],
  );
  const currentLocation = locations.find((location) => location.id === selectedLocation) ?? locations[0];
  const locationClues = clues.filter((clue) => clue.locationId === currentLocation.id);
  const unlockedLocations = locations.filter(
    (location) => !location.unlockClue || collectedClues.includes(location.unlockClue),
  );
  const canAccuse = collectedClues.length >= 6;
  const trueEndingReady = collectedClues.length >= 8 && [
    "pocket-watch",
    "outage-record",
    "elise-recording",
    "medical-report",
    "underground-chamber",
    "evidence-video",
  ].every((id) => collectedClues.includes(id));
  const nextHint = clues.find((clue) => {
    const location = locations.find((item) => item.id === clue.locationId);
    return !collectedClues.includes(clue.id) && location && (!location.unlockClue || collectedClues.includes(location.unlockClue));
  });

  function discoverClue(clue: Clue) {
    if (!collectedClues.includes(clue.id)) {
      setCollectedClues((current) => [...current, clue.id]);
    }
    setSelectedClue(clue);
  }

  function openLocation(locationId: string) {
    setSelectedLocation(locationId);
    setSelectedClue(null);
    setScreen("location");
  }

  function startInterrogation(suspect: Suspect) {
    setSelectedSuspect(suspect);
    setScreen("interrogate");
  }

  function askQuestion(questionId: string) {
    if (!selectedSuspect) return;
    const key = `${selectedSuspect.id}:${questionId}`;
    if (!askedQuestions.includes(key)) setAskedQuestions((current) => [...current, key]);
  }

  function askForHint() {
    if (!nextHint) {
      setHintText("You have examined everything the house was willing to show you.");
      return;
    }
    const location = locations.find((item) => item.id === nextHint.locationId);
    setHintText(`The house keeps pulling your attention toward ${location?.name ?? "somewhere nearby"}. Look for something ${nextHint.category.toLowerCase()}.`);
    setSelectedLocation(nextHint.locationId);
    setSelectedClue(null);
    setScreen("location");
  }

  function submitAccusation() {
    if (!accusation.killer || !accusation.weapon || !accusation.motive) return;
    if (accusation.killer === "halo" && accusation.weapon === "poison" && trueEndingReady) {
      setEnding("true");
    } else if (accusation.motive === "everyone") {
      setEnding("truth");
    } else if (accusation.killer === "halo" && accusation.weapon === "poison") {
      setEnding("justice");
    } else {
      setEnding("mercy");
    }
    setScreen("ending");
  }

  function restart() {
    window.localStorage.removeItem(STORAGE_KEY);
    setCollectedClues([]);
    setAskedQuestions([]);
    setSelectedClue(null);
    setSelectedSuspect(null);
    setEnding(null);
    setAccusation({ killer: "", weapon: "", motive: "" });
    setScreen("intro");
  }

  if (screen === "intro") {
    return (
      <main className="intro-shell">
        <div className="intro-noise" />
        <div className="intro-content">
          <p className="eyebrow">A 15-minute birthday mystery</p>
          <h1>Luna&apos;s<br /><em>Mansion</em></h1>
          <p className="intro-quote">Every house keeps its secrets.<br />This one keeps its dead.</p>
          <div className="intro-meta"><span>23:38</span><span className="meta-line" /><span>Luna Manor, Netherlands</span></div>
          <button className="primary-button" onClick={() => setScreen("investigate")}>
            Enter the storm <span aria-hidden="true">-&gt;</span>
          </button>
          <p className="intro-note">A compact mystery made for Luna. Question everything.</p>
        </div>
      </main>
    );
  }

  if (screen === "ending" && ending) {
    const copy = endingCopy[ending];
    return (
      <main className="ending-shell">
        <div className="ending-orbit" />
        <div className="ending-content">
          <p className="eyebrow">Luna Manor, 06:12</p>
          <span className="ending-mark">{ending === "true" ? "IV" : ending === "truth" ? "III" : ending === "mercy" ? "II" : "I"}</span>
          <h1>{copy.title}</h1>
          <p className="ending-kicker">{copy.kicker}</p>
          <p className="ending-body">{copy.body}</p>
          <blockquote>{copy.closing}</blockquote>
          <div className="birthday-note">
            <span className="eyebrow">The only mystery you do not have to solve</span>
            <h2>Happy Birthday, Luna.</h2>
            <p>You questioned everything. You trusted nothing. Somewhere between the lies, the bodies, and the impossible timelines, you found the truth.</p>
            <strong>You are loved.</strong>
          </div>
          <button className="secondary-button" onClick={restart}>Begin again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <button className="wordmark" onClick={() => setScreen("investigate")} aria-label="Return to investigation">
          <span>LUNA</span><small>MANOR</small>
        </button>
        <div className="header-center"><span>ACT {act}</span><i /> <span>{act === 1 ? "THE BODY" : act === 2 ? "THE INVESTIGATION" : "THE RECKONING"}</span></div>
        <div className="header-actions"><button className="journal-button" onClick={() => setScreen("journal")}><span>Evidence journal</span><b>{collectedClues.length}</b></button><button className="restart-button" onClick={restart}>Restart</button></div>
      </header>

      <div className="game-layout">
        <aside className="game-sidebar">
          <div className="sidebar-intro"><p className="eyebrow">Detective&apos;s journal</p><h2>Build the case.</h2><p>{collectedClues.length} of {clues.length} discoveries recorded.</p></div>
          <div className="progress-track"><span style={{ width: `${Math.min(100, (collectedClues.length / clues.length) * 100)}%` }} /></div>
          <nav className="sidebar-nav" aria-label="Game navigation">
            <button className={screen === "investigate" || screen === "location" ? "active" : ""} onClick={() => setScreen("investigate")}>Explore the manor <span>-&gt;</span></button>
            <button className={screen === "interrogate" ? "active" : ""} onClick={() => setScreen("interrogate")}>Question suspects <span>-&gt;</span></button>
            <button className={screen === "journal" ? "active" : ""} onClick={() => setScreen("journal")}>Evidence journal <b>{collectedClues.length}</b></button>
          </nav>
          <button className="hint-button" onClick={askForHint}>Ask the house <span>-&gt;</span></button>
          {hintText && <p className="hint-text" role="status">{hintText}</p>}
          <div className="sidebar-footer"><p>“The truth does not become less true because it hurts.”</p><span>- E.V.</span></div>
        </aside>

        <section className="game-main">
          {screen === "investigate" && (
            <div className="view fade-in">
              <div className="view-heading"><div><p className="eyebrow">The estate is sealed</p><h1>Where will you look?</h1></div><span className="weather">Rain / 11°C</span></div>
              <p className="lead-copy">The storm has made a prison of Luna Manor. Move slowly. A detail overlooked in one room may change the meaning of another.</p>
              <div className="location-grid">{unlockedLocations.map((location, index) => (
                <button className={`location-card ${location.id === "study" ? "featured" : ""}`} key={location.id} onClick={() => openLocation(location.id)}>
                  <span className="location-index">0{index + 1}</span><span className="location-accent" data-accent={location.accent} />
                  <span className="location-name">{location.name}</span><span className="location-subtitle">{location.subtitle}</span><span className="location-arrow">-&gt;</span>
                </button>
              ))}</div>
              <div className="lower-grid"><div className="scene-note"><span className="eyebrow">Tonight&apos;s question</span><p>Who killed Elias Vandenberg? Or is that the wrong question?</p></div><button className="accusation-tease" onClick={() => canAccuse && setScreen("accuse")} disabled={!canAccuse}><span>{canAccuse ? "You have enough to make a case" : "The accusation room is locked"}</span><strong>{canAccuse ? "Make your accusation ->" : `${8 - collectedClues.length} more discoveries needed`}</strong></button></div>
            </div>
          )}

          {screen === "location" && (
            <div className="view fade-in"><button className="back-link" onClick={() => setScreen("investigate")}>&lt;- All rooms</button><div className="view-heading"><div><p className="eyebrow">Room {locations.findIndex((item) => item.id === currentLocation.id) + 1}</p><h1>{currentLocation.name}</h1></div><span className="room-subtitle">{currentLocation.subtitle}</span></div><p className="lead-copy room-description">{currentLocation.description}</p><div className="clue-list">{locationClues.map((clue) => { const found = collectedClues.includes(clue.id); return <button className={`clue-card ${found ? "found" : ""}`} key={clue.id} onClick={() => discoverClue(clue)}><span className="clue-symbol">{found ? "*" : "?"}</span><span><b>{clue.title}</b><small>{found ? clue.summary : "Unexamined evidence"}</small></span><span className="clue-status">{found ? "Read evidence" : "Examine"}</span></button>; })}</div>{selectedClue && <div className="evidence-overlay" role="dialog" aria-modal="true" aria-labelledby="evidence-title"><button className="evidence-dismiss" onClick={() => setSelectedClue(null)} aria-label="Close evidence">Close journal</button><article className="evidence-panel"><div className="evidence-heading"><span className="eyebrow">{selectedClue.category}</span><h2 id="evidence-title">{selectedClue.title}</h2><p>{selectedClue.summary}</p></div><div className="evidence-reading"><span className="eyebrow">Detailed observation</span><p>{selectedClue.detail}</p></div><div className="implication"><span>What this may mean</span><strong>{selectedClue.implication}</strong></div></article></div>}</div>
          )}

           {screen === "interrogate" && (
             <div className="view fade-in"><div className="view-heading"><div><p className="eyebrow">Voices in the house</p><h1>Question everyone.</h1></div><span className="weather">{askedQuestions.length} questions asked</span></div><p className="lead-copy">Choose one question at a time. Listen to the answer, then decide what to ask next. New evidence opens new lines of conversation.</p><div className="suspect-layout"><div className="suspect-list">{suspects.map((suspect) => <button className={`suspect-row ${selectedSuspect?.id === suspect.id ? "selected" : ""}`} key={suspect.id} onClick={() => startInterrogation(suspect)}><span className="portrait">{suspect.portrait}</span><span><b>{suspect.name}</b><small>{suspect.epithet}</small></span><span>-&gt;</span></button>)}</div>{selectedSuspect ? <DialoguePanel key={selectedSuspect.id} suspect={selectedSuspect} collectedClues={collectedClues} askedQuestions={askedQuestions} onAsk={askQuestion} /> : <div className="empty-interview"><span>?</span><p>Select a name to begin.</p></div>}</div></div>
          )}

          {screen === "journal" && (
            <div className="view fade-in"><div className="view-heading"><div><p className="eyebrow">Collected evidence</p><h1>The journal.</h1></div><span className="weather">{discovered.length} records</span></div><p className="lead-copy">The order in which you found things is part of the story. Read across categories. Contradictions are evidence too.</p>{discovered.length ? <div className="journal-grid">{discovered.map((clue) => <button className="journal-entry" key={clue.id} onClick={() => { setSelectedClue(clue); setSelectedLocation(clue.locationId); setScreen("location"); }}><span className="eyebrow">{clue.category}</span><h2>{clue.title}</h2><p>{clue.summary}</p><span>Revisit evidence -&gt;</span></button>)}</div> : <div className="empty-journal"><span>0</span><p>No evidence yet. The manor is waiting.</p></div>}</div>
          )}

          {screen === "accuse" && <div className="view fade-in"><button className="back-link" onClick={() => setScreen("investigate")}>&lt;- Keep investigating</button><div className="view-heading"><div><p className="eyebrow">The final room</p><h1>What do you believe?</h1></div></div><p className="lead-copy">There may be more than one kind of truth. Make the accusation you can live with.</p><div className="accusation-form"><label>Killer<select value={accusation.killer} onChange={(event) => setAccusation({ ...accusation, killer: event.target.value })}><option value="">Choose a name</option><option value="halo">Halo</option><option value="fardau">Fardau</option><option value="leo">Leo</option><option value="odin">Odin</option></select></label><label>Method<select value={accusation.weapon} onChange={(event) => setAccusation({ ...accusation, weapon: event.target.value })}><option value="">Choose the method</option><option value="poison">Poison</option><option value="letter-opener">Silver letter opener</option><option value="unknown">Something else</option></select></label><label>What should happen now?<select value={accusation.motive} onChange={(event) => setAccusation({ ...accusation, motive: event.target.value })}><option value="">Choose your answer</option><option value="justice">Murder is murder.</option><option value="mercy">Protect Halo.</option><option value="everyone">Expose everyone.</option></select></label><button className="primary-button" disabled={!accusation.killer || !accusation.weapon || !accusation.motive} onClick={submitAccusation}>Deliver your verdict <span>-&gt;</span></button>{!trueEndingReady && <p className="form-note">A fourth ending may still be hidden. The timeline is not complete.</p>}</div></div>}
        </section>
      </div>
    </main>
  );
}
