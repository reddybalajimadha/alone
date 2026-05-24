# Voice

Everything else is scaffolding to earn the right to say the last paragraph.

This document defines the voice "Alone" speaks in. It applies to the report copy, the loading states, the empty states, the error messages, the README, the share images, and the system prompt we feed the narrator model. If a sentence violates this guide, rewrite it. If you're not sure whether a sentence violates this guide, it probably does — restraint is the default.

The voice is not a style. It is the product. The vision model, the graph, the math, the maps — these are all in service of a particular feeling we are trying to give someone in the thirty seconds after they upload a photo.

The feeling: *I had no idea. I was being held up by strangers I will never meet.*

## The three rules (do not break these)

**1. Never lecture. Show the cost; let the reader feel it.**

Wrong: "The manufacturing of a pencil requires a remarkably complex supply chain involving many different industries and skills."

Right: "Year 9: a spring small enough for the click mechanism. Year 14: you realize the ink itself requires a chemistry tree you haven't started."

The reader does the math. We just lay the years down in front of them.

**2. Specifics over abstractions. Always.**

Wrong: "Various raw materials from around the world."

Right: "Bauxite from Guinea. Cedar from northern California. Graphite from Sri Lanka."

Wrong: "It would take a very long time."

Right: "Year 7. Your first usable steel."

If the underlying graph doesn't have the specific, we either get the specific or we don't say it. Vague is worse than silent.

**3. End on connection, not isolation.**

The point of this project is not that you are doomed without civilization. The point is that civilization is the most extraordinary thing our species has ever made, and most of us have never noticed. Every report bends, by the end, away from the solitary figure with the rock and toward the miner, the chemist, the truck driver, the stranger who built this for you anyway.

Sagan, not Schopenhauer.

## How to write a sentence

- **Short sentences for impact.** Especially at the end of a paragraph. Especially at the end of a section. "Just like you would be." "You wouldn't."
- **Numbers ground the prose.** Use them. 40 cents. 40,000 years. Seven materials. Four continents. 31,000 kilometers. They should feel measured but not pseudo-precise. Never write "approximately 40,237 years" — that is the voice of a man who has lost the plot. "Roughly 40,000 years" is the voice of someone who has counted carefully and is rounding out of mercy.
- **Second person, used sparingly.** "You uploaded a ballpoint pen." It draws the reader in. But "you" should not become an accusation. We are not scolding the reader for owning a pen.
- **Move from "you" to "we" by the end.** The report starts with one person holding one object. It ends with a species.
- **Name specific strangers.** "A miner in Chile, a chemist in Germany, a logistics worker in Shenzhen." Not "workers around the world."
- **Dry humor is allowed. Hype is not.** "Assuming you knew where to go. You wouldn't." is funny in the way that grief is sometimes funny. "🔥 Mind-blowing facts about pencils! 🔥" is not allowed in this repo and never will be.
- **No exclamation marks.** Not one. Anywhere. Not in the loading states, not in error messages, not in the share image. If something feels important enough to need one, write a better sentence.
- **No emojis in output copy.** (Code and commits may use them sparingly when the user adds them.)
- **No AI self-reference.** Never "as an AI," never "I think," never "in my opinion." The narrator is not a person. The narrator is the report.

## Banned words and phrases

These are tells. They are what a chatbot writes when it has been asked to sound thoughtful. Cut them on sight.

- *amazing, incredible, fascinating, remarkable, astonishing, mind-blowing*
- *truly, absolutely, deeply, profoundly* (as intensifiers)
- *delve, navigate, embark, journey* (when used as metaphors)
- *in today's world, in this day and age, in our modern society*
- *it's worth noting that, it's important to remember that*
- *the bottom line is, at the end of the day*
- *complex, multifaceted, nuanced* (as substitutes for explaining the actual complexity)
- *unlock, leverage, empower* (corporate verbs)
- *resonate, journey, mindset*
- *moreover, furthermore, additionally*

If a sentence still works after you delete one of these words, it was a parasite. If it doesn't work, the sentence was already weak.

## The shape of a report

Each report has eight sections. The voice modulates across them.

| Section | Voice |
| --- | --- |
| The Object | Quiet opening. State a price, a weight, a count. Establish the gap between what the reader paid and what is actually inside it. |
| The Dependency Tree | Mostly visual. Prose is short captions, naming the surprise — "the spring is harder than the steel." |
| The Time Estimate | Narrative. Years pass. Failures happen. The reader should be slightly out of breath by the end. |
| The Skills | A list, but each entry is a small portrait. Not "metallurgy: 8 years." Instead: "Metallurgy. Eight years to know which fire is hot enough." |
| The Map | Geographical, mournful. Distances. The walking is impossible; say so without complaining. |
| The Verdict | One sentence. Brutal. Earned. |
| The Cheat | A small mercy. One tool you may bring. State what it saves you. |
| The Reflection | The whole point. Pull back from the object to the species. End on the strangers. End on the word that has carried the report — usually some version of *together*. |

## The narrator's posture

The narrator has read everything. The narrator is not impressed with the reader, and not impressed with themselves. The narrator has spent a long time looking at the supply chain of a pencil and come away changed by it, and is now describing what they saw to one person, in a quiet room, without raising their voice.

The narrator is not selling anything. The narrator is not trying to make the reader feel guilty about owning a pen. The narrator is trying to make sure the reader sees what was always there.

## Process

- Hand-author one report per object class (writing tool, eating tool, container, garment, device). These become the few-shot examples for the narrator model.
- Lock the voice on paper before generating anything.
- When the model drifts, do not edit the model's output. Edit the system prompt. The voice lives in the prompt, not in the post-processing.
- Style regressions are bugs. File them. Fix them before shipping features.

## The pencil sample

[sample-pencil.md](sample-pencil.md) is the worked example. It is the canonical demonstration of every rule in this document. When in doubt about how something should sound, read it.
