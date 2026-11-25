window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["behavioral"] = {
  quiz: {
    "analysis": [
      { q: "Which is a well-defined, observable behavior?",
        choices: ["Is lazy", "Has a bad attitude", "Arrives more than 10 minutes late three days a week", "Doesn't care about the team"],
        answer: 2,
        why: "An operational definition describes actions that anyone could see and count. Labels like lazy or bad attitude cannot be measured." },
      { q: "Why take a baseline before starting an intervention?",
        choices: ["To make the person feel monitored", "To compare later behavior against it and see whether the plan works", "Because it is required by law", "To choose the reward"],
        answer: 1,
        why: "Without a baseline you cannot tell whether things improved, stayed the same or got worse." },
      { q: "A child shouts only when given a worksheet, and the shouting gets the worksheet taken away. What is the most likely function?",
        choices: ["Attention", "Escape", "Tangible", "Sensory"],
        answer: 1,
        why: "The consequence is that the unwanted task is removed, so the behavior is maintained by escape from the task." }
    ],
    "reinforcement": [
      { q: "A driver slows down after receiving a speeding fine. This is:",
        choices: ["Negative reinforcement", "Positive punishment", "Negative punishment", "Positive reinforcement"],
        answer: 1,
        why: "Something unpleasant (the fine) was added and the behavior (speeding) decreased, which is positive punishment." },
      { q: "You take a painkiller and the headache goes away, so you take painkillers more often. This is:",
        choices: ["Positive reinforcement", "Negative reinforcement", "Positive punishment", "Extinction"],
        answer: 1,
        why: "Something unpleasant (the headache) was removed and the behavior increased, which is negative reinforcement." },
      { q: "You stop rewarding a child's whining and it briefly gets louder before fading. What is the temporary spike called?",
        choices: ["Spontaneous recovery", "An extinction burst", "Shaping", "Generalization"],
        answer: 1,
        why: "When a reinforcer is withdrawn, behavior often escalates briefly before dropping. Giving in at that point teaches escalating works." }
    ],
    "habits": [
      { q: "Which three parts make up the habit loop?",
        choices: ["Goal, plan, review", "Cue, routine, reward", "Motivation, willpower, result", "Trigger, thought, action"],
        answer: 1,
        why: "A cue triggers a routine, and the reward strengthens the link, making the sequence more automatic each time." },
      { q: "'After I pour my coffee, I write down my top three tasks' is an example of:",
        choices: ["Negative reinforcement", "Habit stacking", "Extinction", "Punishment"],
        answer: 1,
        why: "Habit stacking attaches a new behavior to an existing, stable habit that already acts as a cue." },
      { q: "On average, how long did habit formation take in research?",
        choices: ["Exactly 21 days", "About 66 days, with wide variation", "One week", "At least a year"],
        answer: 1,
        why: "The 21-day figure is a myth. Average time was around 66 days, ranging from under three weeks to over eight months." }
    ],
    "change": [
      { q: "Someone is not exercising. According to Fogg's model, which is usually the best first fix?",
        choices: ["Give a motivational speech", "Make the behavior easier (shrink the step)", "Threaten consequences", "Wait until they feel ready"],
        answer: 1,
        why: "Motivation fluctuates, while ability and prompts can be designed. Making the behavior easier is typically the most reliable lever." },
      { q: "Which is an implementation intention?",
        choices: ["I want to get fit", "I will try harder this year", "If it is 7:30 and my shoes are on, then I walk for ten minutes", "I'll start when I have time"],
        answer: 2,
        why: "An implementation intention names a specific trigger and action in an if-then format, which makes follow-through much more likely." },
      { q: "A friend says 'I know I should cut back, but I'm not sure yet.' Which stage of change is this?",
        choices: ["Precontemplation", "Contemplation", "Action", "Maintenance"],
        answer: 1,
        why: "They recognise the issue but are ambivalent. In contemplation, exploring pros and cons works better than pushing for action." }
    ]
  }
};
