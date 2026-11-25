window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["learning"] = {
  quiz: {
    "classical": [
      { q: "In Pavlov's experiment, which item became the <strong>conditioned stimulus</strong>?",
        choices: ["Salivation", "The bell", "The food", "The dog"],
        answer: 1,
        why: "The bell started as a neutral sound. After being paired with food many times, it triggered salivation by itself, which makes it the conditioned stimulus." },
      { q: "You ring the bell again and again without ever giving food. What happens to the salivation?",
        choices: ["It gets stronger", "It gradually weakens (extinction)", "It disappears forever and can never return", "It switches to a different response"],
        answer: 1,
        why: "Without the food to back it up, the bell loses its power. This is extinction. The response can still return later through spontaneous recovery, so the learning is suppressed, not erased." },
      { q: "An advert plays cheerful music while showing a new drink. Which mechanism makes viewers feel good about the drink?",
        choices: ["Operant conditioning", "Classical conditioning", "Shaping", "Vicarious learning"],
        answer: 1,
        why: "The drink is paired with music that already makes people feel good, so the good feeling transfers to the drink. That is association, the core of classical conditioning." }
    ],
    "operant": [
      { q: "A car alarm stops the moment you buckle your seatbelt, so you buckle up faster next time. This is:",
        choices: ["Positive punishment", "Negative punishment", "Negative reinforcement", "Classical conditioning"],
        answer: 2,
        why: "Removing something unpleasant (the alarm) after a behavior makes that behavior more likely. Removing a bad thing to increase behavior is negative reinforcement." },
      { q: "Which reinforcement schedule produces the steadiest, hardest-to-extinguish responding, as with slot machines?",
        choices: ["Fixed ratio", "Fixed interval", "Variable ratio", "Continuous reinforcement"],
        answer: 2,
        why: "When rewards arrive after an unpredictable number of responses, every try might be the winning one, so people and animals keep going for a long time." },
      { q: "To teach a dog to roll over, you first reward lying down, then a half-turn, then the full roll. This technique is called:",
        choices: ["Shaping", "Extinction", "Modeling", "Higher-order conditioning"],
        answer: 0,
        why: "Shaping rewards successive approximations, small steps that get closer and closer to the final behavior." }
    ],
    "social": [
      { q: "In Bandura's Bobo doll study, children copied an adult's aggression. What does this show?",
        choices: ["Learning needs a direct reward", "People can learn by watching others", "Aggression is inherited", "Children cannot learn from adults"],
        answer: 1,
        why: "The children were never rewarded. They learned the behavior simply by observing the model, which is observational learning." },
      { q: "Which model are you MOST likely to imitate?",
        choices: ["Someone you dislike who is punished", "A stranger who is ignored", "A respected person similar to you who is rewarded", "Someone with no visible outcome"],
        answer: 2,
        why: "We copy models who are similar to us, admired, and seen being rewarded. Seeing a punishment makes us less likely to copy." },
      { q: "Watching a colleague like you succeed at a hard task makes you more willing to try. Bandura called this boost in belief:",
        choices: ["Extinction", "Self-efficacy", "Spontaneous recovery", "Negative reinforcement"],
        answer: 1,
        why: "Self-efficacy is your belief that you can succeed. Seeing someone similar succeed raises it, and higher self-efficacy increases effort and persistence." }
    ],
    "apply": [
      { q: "You want an exercise habit. Which plan uses classical, operant AND social learning together?",
        choices: ["Exercise at random times and hope for the best", "Same time and place with a favourite playlist, a small treat afterwards, and a friend who exercises too", "Punish yourself when you skip a day", "Read about exercise once a week"],
        answer: 1,
        why: "A fixed cue and playlist build the association, the immediate treat reinforces the behavior, and the friend provides a model and accountability." },
      { q: "A new hire is struggling to learn team norms. Which approach best uses social learning?",
        choices: ["Email a long policy document", "Pair them with a respected colleague to shadow for a week", "Remove their access until they improve", "Give them a bonus at year end"],
        answer: 1,
        why: "Observing a respected, similar model lets them see the behavior and its rewards directly, which is how norms are usually absorbed." }
    ]
  }
};
