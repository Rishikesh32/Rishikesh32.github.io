window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["career"] = {
  quiz: {
    "ai-assistants": [
      { q: "What should you provide an AI assistant to get an accurate SQL query on the first pass?",
        choices: ["Only the question in natural language", "Table schema (column names and data types), SQL dialect, business logic definitions, and the expected output grain", "The password to the production database", "A screenshot of your desktop"],
        answer: 1,
        why: "AI models hallucinate column names and syntax without schema context. Supplying explicit DDL, dialect (Postgres vs Snowflake), metric formulas, and grain guarantees reliable first-draft SQL." },
      { q: "What is the single most dangerous failure mode when using LLMs for data analysis?",
        choices: ["The model runs out of tokens", "Plausible hallucinations: generating queries with subtle semantic errors (e.g., inner join dropping nulls or wrong denominator) that look completely valid", "Slow response latency", "The model converts all numbers to Roman numerals"],
        answer: 1,
        why: "LLM-generated code often compiles and runs without syntax errors, but produces silently incorrect numbers through flawed join logic or incorrect filter conditions." },
      { q: "Before presenting an AI-generated number to stakeholders, what verification check is essential?",
        choices: ["Verify row counts, check against known baseline totals, test edge cases (NULLs/dates), and inspect the generated SQL line-by-line", "Rerun the prompt three times and see if it looks similar", "Ask the AI if it is confident", "Change the font to monospace"],
        answer: 0,
        why: "Responsible analysts never ship unverified numbers. Hand-calculating a small sample and checking invariants ensures accuracy." }
    ],
    "automation": [
      { q: "When does it make economic sense to automate a recurring manual report?",
        choices: ["Automate every task immediately, regardless of time spent", "When (hours saved over the report lifetime) exceeds (hours to build, test, and maintain the pipeline)", "Only when executives mandate it in writing", "Never, manual checking is always safer"],
        answer: 1,
        why: "Automation carries build and maintenance overhead. If a report takes 15 minutes a month and will be decommissioned in three months, spending 20 hours automating it is a net loss." },
      { q: "What should every automated reporting script do if an input table is unexpectedly empty or schema changes?",
        choices: ["Fill missing numbers with zeros and send the email anyway", "Fail loudly, log the exact error, and alert the maintainer immediately without sending corrupt data", "Guess the previous week's numbers", "Wait silently for 48 hours"],
        answer: 1,
        why: "Silent failures mislead decision-makers with bad data. Reliable pipelines fail fast and loud with explicit alerts." },
      { q: "Why should automated scripts use parameters and environment variables instead of hardcoded dates and credentials?",
        choices: ["To allow backfilling historical runs, dynamic execution windows, and secure credential handling via secrets managers", "Because Python cannot parse string dates", "To make the file size smaller", "Hardcoded dates are illegal under ISO standards"],
        answer: 0,
        why: "Parameterized pipelines can be backfilled for any date range without modifying code, and keeping secrets in environment variables prevents credential leaks." }
    ],
    "ethics-privacy": [
      { q: "What is a quasi-identifier in a customer dataset?",
        choices: ["A primary key like user_id", "A combination of non-sensitive attributes (such as ZIP code, birthdate, and gender) that can uniquely re-identify an individual when linked with external data", "A corrupted database index", "A temporary column used in CTEs"],
        answer: 1,
        why: "Over 87% of the US population can be uniquely identified by the combination of 5-digit ZIP code, gender, and date of birth alone." },
      { q: "What does k-anonymity guarantee in a released analytical dataset?",
        choices: ["That every query completes in k seconds", "Each individual's quasi-identifiers are identical to at least k - 1 other individuals in the dataset", "That all names have at least k letters", "The dataset contains at most k rows"],
        answer: 1,
        why: "A dataset possesses k-anonymity if each record cannot be distinguished from at least k - 1 other individuals regarding quasi-identifying attributes." },
      { q: "A credit scoring model performs significantly worse on applicants from minority postcodes. What type of bias does this represent?",
        choices: ["Selection bias in hardware", "Proxy discrimination / historical bias where geographic features act as proxies for protected demographic classes", "Overfitting on RAM", "Measurement error in timestamps"],
        answer: 1,
        why: "Machine learning models learn historical inequities present in training data. Non-protected variables (like neighborhood or school) can proxy for protected attributes." }
    ],
    "portfolio": [
      { q: "What is the most effective way to structure the README of a data analytics portfolio project?",
        choices: ["Start with 500 lines of data cleaning code", "Lead with the business question, headline findings, key recommendations, and a visual before explaining methodology and code", "List every Python package installed", "Upload a single 50MB CSV file with no text"],
        answer: 1,
        why: "Hiring managers and stakeholders read top-down. Leading with the business context and actionable insights demonstrates commercial acumen." },
      { q: "Why are projects on unique or self-collected datasets viewed more favorably by interviewers than standard Titanic/Iris datasets?",
        choices: ["Because Kaggle datasets cannot be legally viewed on GitHub", "They demonstrate end-to-end problem definition, data collection, wrangling, and original analytical thinking rather than following pre-baked tutorials", "Unique datasets are always smaller", "Titanic data crashes modern browsers"],
        answer: 1,
        why: "Standard tutorial datasets show copy-paste ability; original datasets prove you can navigate real-world ambiguity, messiness, and business questions." },
      { q: "What should you do with proprietary business data from past jobs when building your public portfolio?",
        choices: ["Upload it directly so interviewers can see real numbers", "Never publish proprietary data; use synthetic data, obfuscate company specifics, or build on public/open datasets", "Change the font and upload it anyway", "Store it on an unlisted public gist"],
        answer: 1,
        why: "Sharing confidential employer data violates NDAs and demonstrates poor ethical judgment to prospective employers." }
    ],
    "interviews": [
      { q: "In a product analytics case interview, the interviewer asks: 'Weekly Active Users dropped by 8% last week. How would you investigate?' What is the best first step?",
        choices: ["Immediately write a 100-line SQL query", "Clarify the definition, time window, whether the drop was sudden or gradual, and verify data logging integrity before segmenting", "Blame the engineering team", "Recommend redesigning the homepage"],
        answer: 1,
        why: "Always clarify scope and verify measurement first. A tracking bug or app store outage often causes apparent metric drops before real behavior changes." },
      { q: "When solving a live SQL interview question, what should you do as you write your query?",
        choices: ["Stay completely silent until the query is finished", "Communicate your thought process out loud: state your assumptions, planned join keys, handling of NULLs, and grain at each step", "Type as fast as possible to show typing speed", "Refuse to use CTEs because they are too readable"],
        answer: 1,
        why: "Interviewers care more about structured reasoning, edge-case awareness, and communication than raw typing speed." },
      { q: "In the STAR method for behavioral questions, what does the 'R' stand for?",
        choices: ["Regression", "Result — quantify the measurable business impact and what you learned from the experience", "Repository", "Randomization"],
        answer: 1,
        why: "STAR stands for Situation, Task, Action, and Result. Strong answers always ground the result in quantifiable numbers (e.g., 'saved 6 hours/week', 'reduced churn by 1.2%')." }
    ],
    "career-paths": [
      { q: "How does the role of an Analytics Engineer differ from a Product Data Analyst?",
        choices: ["Analytics engineers focus on software engineering best practices, data modeling (dbt), testing, and curated warehouse layers; product analysts focus on user behavior, metric design, experiments, and exploratory insights", "Analytics engineers don't know SQL", "Product analysts build physical hardware", "There is no difference"],
        answer: 0,
        why: "Analytics engineers build clean, tested, governed dimensional models (dbt/Snowflake) that downstream analysts, data scientists, and business users consume." },
      { q: "What distinguishes a Staff or Principal Analyst from a Senior Analyst?",
        choices: ["Writing more lines of SQL per day", "Operating cross-functionally, shaping company strategy, mentoring team members, establishing organizational data standards, and tackling ambiguously defined challenges", "Only using AI tools for everything", "Having 25 monitors"],
        answer: 1,
        why: "Staff+ roles operate at organizational scope: identifying unasked strategic questions, setting standards, and multiplying the effectiveness of others." },
      { q: "When deciding whether to specialize in ML engineering, BI architecture, or product analytics, what should guide your decision?",
        choices: ["Whatever programming language was invented most recently", "The intersection of your intrinsic interest (building systems vs advising strategy), market demand, and your proven strengths", "Whichever role uses the most spreadsheets", "Random choice"],
        answer: 1,
        why: "Sustainable career growth comes from aligning your natural strengths (e.g. system engineering vs product strategy and storytelling) with market needs." }
    ]
  }
};
