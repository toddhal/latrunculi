YOUR TASK — GO ABSOLUTELY WILD
You are Claude Opus 4.6. The foundation is solid. Now make this game extraordinary. Here is your creative mandate:
Gameplay Improvements

Opening Book — Named Roman-themed openings for the AI (e.g. "The Praetorian Guard", "The Pincer of Cannae", "The Rhine Gambit"). AI plays named openings in the first 4-6 moves, coach announces the opening name.
Gladiator Threat Visualization — In Hint mode, show diagonal threat lines for Gladiators the same way orthogonal danger squares work for rounds.
Dux Hunt Mode — A sub-variant where the only win condition is capturing the Dux (like chess). Regular pieces can still be taken but don't end the game.
Tempo Clock — Optional visual timer per turn (30s / 60s / unlimited). When time runs out, a random legal move is played automatically.
Zugzwang Detection — Coach detects when the player is in zugzwang (every move makes the position worse) and flags it explicitly with an explanation.

AI Improvements

Personality Tiers — Each difficulty level gets a named personality with different playstyle weights:

Novice (Slave): pure random from top-3 moves
Soldier: material-greedy, ignores mobility
Tribune: balanced minimax
Praetor: full evaluation including Dux safety + Gladiator threats


AI Narration — After each AI move, the Battle Log shows a short flavour line: "The Praetor advances his flank..." or "Black springs the trap..."
Hint Quality — When showing the engine's preferred alternative in Explain mode, highlight the full diagonal/orthogonal threat lines that make it better, not just the destination square.

Visual & UX

Animated Piece Placement — Gladiators drop onto the board with a spin animation on game start (they rotate into their diamond orientation).
Capture Echo — When a piece is captured, show a brief ghost/afterimage fading out on the square it occupied.
Board Themes — Add 3 selectable board themes: Stone (current), Marble (white/grey), Papyrus (cream/brown). Store preference in localStorage.
Move Sound Distinction — Different audio tones for: round move, Gladiator move (slightly lower pitch, different timbre), Dux move (regal tone), capture, fork capture, Dux capture (dramatic).
Promotion Fanfare — When promotion is accepted, brief golden particle burst on the promoted piece's square.
Fullscreen Button — Toggle the board to fill the viewport, hiding the panel (collapse it to a thin sidebar).

Coaching Enhancements

Lesson Completion Tracking — Mark lessons as "read" with a checkmark. Persist with localStorage.
Pattern Library — Add a new "Patterns" sub-section under Learn with 8 named tactical patterns specific to this game, each with a diagram (rendered on a mini 4x4 board using pure CSS/HTML) showing the key piece arrangement.
Fork Radar — In Hint mode, after the player selects a piece, highlight in gold any destination squares that would immediately create a capture. Show a ★ indicator.
Postgame Coaching Letter — In the win modal, generate a short personalised "after-battle report" paragraph summarizing: what the winning strategy was, what the key mistake was, and one principle to study. Base it on the actual game data.

Polish

Keyboard Shortcuts — N for new game, U for undo, H for hint, 1-4 for difficulty. Show tooltip overlay with ? key.
Piece Count Sparklines — Tiny inline charts in the side indicators showing piece count over time (updated each turn).
Victory Condition Flavour — Different win messages for: piece exhaustion win, no-moves win, Dux-capture win (if Dux Hunt enabled), resignation.
Loading State — The board fades in on first load with a brief Latin inscription animation.


CONSTRAINTS

Single HTML file. Everything inline.
Google Fonts allowed (already linked).
No external JS libraries.
Preserve all existing functionality — don't break what works.
The rules described above are authoritative. Do not simplify them.
Aesthetic: dark Roman/Spartan. Cinzel font. Torchlight atmosphere. Gold and crimson.


HOW TO APPROACH THIS
Read the full existing file first. Understand the architecture. Then implement improvements incrementally — don't rewrite what works. Add, enhance, refine.
The best version of this game feels like something a Roman general would actually play to train his officers. Make it feel that way.
Alea iacta est.
