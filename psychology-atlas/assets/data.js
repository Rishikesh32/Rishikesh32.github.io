/* Single source of truth for areas and subtopics.
   Topic pages must use <section class="topic" id="SUBTOPIC_ID"> with the ids below. */
/* Areas whose pages are finished. Add an id here when its page, quizzes and scene are done. */
window.ATLAS_LIVE = ["learning", "cognitive", "behavioral", "motivation", "communication", "teams", "performance", "change", "wellbeing"];
window.ATLAS = {
  tiers: [
    { id: "A", name: "Foundational Theories", blurb: "Core psychology theories that explain behavior and mind", color: "var(--t1)" },
    { id: "B", name: "Applied in Work", blurb: "How theories apply to real situations and performance", color: "var(--t2)" },
    { id: "C", name: "Life & Well-being", blurb: "Personal applications and mental health", color: "var(--t3)" }
  ],
  areas: [
    { n: 1, id: "learning", file: "01-learning-theories.html", tier: "A", title: "Learning Theories", weeks: "3–4 wks", prereqs: [],
      summary: "Understand how people learn: classical conditioning, operant conditioning, and social learning. Apply these to real behavior change.",
      subs: [
        ["classical", "Classical conditioning (Pavlov)"], ["operant", "Operant conditioning (Skinner)"], ["social", "Social learning theory (Bandura)"],
        ["apply", "How to apply learning theories"]
      ] },
    { n: 2, id: "cognitive", file: "02-cognitive-theories.html", tier: "A", title: "Cognitive Theories", weeks: "3–4 wks", prereqs: [],
      summary: "How we think, process information, and make decisions.",
      subs: [
        ["thinking", "How we think (Piaget)"], ["information", "Information processing"], ["problem", "Problem-solving"],
        ["decisions", "Decision-making & biases"]
      ] },
    { n: 3, id: "behavioral", file: "03-behavioral-theories.html", tier: "A", title: "Behavioral Theories", weeks: "3 wks", prereqs: [],
      summary: "Behavior analysis, reinforcement, habits and behavior change.",
      subs: [
        ["analysis", "Behavior analysis"], ["reinforcement", "Reinforcement & punishment"], ["habits", "Habit formation"],
        ["change", "Behavior change strategies"]
      ] },
    { n: 4, id: "motivation", file: "04-motivation-influence.html", tier: "B", title: "Motivation & Influence", weeks: "3 wks", prereqs: [1],
      summary: "What drives people: intrinsic vs extrinsic motivation, persuasion and incentives.",
      subs: [
        ["intrinsic", "Intrinsic vs extrinsic motivation"], ["persuasion", "Persuasion techniques"], ["incentives", "Incentives & rewards"],
        ["goals", "Goal-setting"]
      ] },
    { n: 5, id: "communication", file: "05-communication-influence.html", tier: "B", title: "Communication & Influence", weeks: "3 wks", prereqs: [4],
      summary: "Effective communication, influence, negotiation and conflict resolution.",
      subs: [
        ["effective", "Effective communication"], ["compliance", "Influence & compliance"], ["negotiation", "Negotiation"],
        ["conflict", "Conflict resolution"]
      ] },
    { n: 6, id: "teams", file: "06-team-dynamics.html", tier: "B", title: "Team & Group Dynamics", weeks: "3 wks", prereqs: [5],
      summary: "Team psychology, leadership, group decision-making and cooperation.",
      subs: [
        ["team", "Team psychology"], ["leadership", "Leadership"], ["group-decisions", "Group decision-making"],
        ["cooperation", "Cooperation & competition"]
      ] },
    { n: 7, id: "performance", file: "07-performance-productivity.html", tier: "C", title: "Performance & Productivity", weeks: "3 wks", prereqs: [4],
      summary: "Motivation at work, stress, flow and peak performance.",
      subs: [
        ["work-motivation", "Motivation at work"], ["stress", "Stress management"], ["flow", "Flow & peak performance"],
        ["burnout", "Burnout prevention"]
      ] },
    { n: 8, id: "change", file: "08-change-management.html", tier: "C", title: "Change Management", weeks: "3 wks", prereqs: [2, 5],
      summary: "Why people resist change and strategies for adoption, habit change and organizational change.",
      subs: [
        ["resistance", "Why people resist change"], ["adoption", "Strategies for adoption"], ["habits", "Habit change"],
        ["org-change", "Organizational change"]
      ] },
    { n: 9, id: "wellbeing", file: "09-mental-health-wellbeing.html", tier: "C", title: "Mental Health & Well-being", weeks: "3 wks", prereqs: [],
      summary: "Stress, anxiety, depression and building resilience and well-being.",
      subs: [
        ["stress-anxiety", "Stress, anxiety & depression"], ["coping", "Coping strategies"], ["resilience", "Building resilience"],
        ["wellbeing", "Well-being practices"]
      ] }
  ]
};

window.ATLAS.areas.forEach(function (a) { a.live = window.ATLAS_LIVE.indexOf(a.id) >= 0; });
