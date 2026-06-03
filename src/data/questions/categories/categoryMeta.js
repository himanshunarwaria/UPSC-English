// ─────────────────────────────────────────────────────────────────────────────
// Category Metadata — UPSC Exam Relevance & Sub-topic Map
//
// Each category documents: why it matters in UPSC, the sub-rules to cover,
// the common trap patterns, and the recommended question-type mix.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_META = [

  {
    id:    'es',
    topic: 'Error Spotting',
    upscWeight: 'Very High',
    target: 900,
    upscRelevance: `
      Error spotting is the single most tested grammar format in UPSC CSE Mains
      Compulsory English. A typical paper has 10–15 error-spotting sentences.
      Each sentence has four underlined parts (A/B/C/D) plus a "No error" option.
      Errors are almost never obvious — they involve subtle rule violations that
      look grammatically correct at first glance.
    `,
    subtopics: [
      'Verb form errors in complex sentences',
      'Subject-verb agreement with intervening phrases',
      'Tense inconsistency in narrative passages',
      'Wrong preposition choice (prepositional collocations)',
      'Article misuse (a/an/the in formal contexts)',
      'Pronoun reference errors',
      'Adjective/adverb confusion',
      'Redundancy (pleonasm) in formal writing',
      'Wrong comparative/superlative forms',
      'Split infinitives in formal register',
      'Dangling and misplaced modifiers',
      'False parallelism',
      'Double negatives',
      'Misuse of "who"/"whom" in subordinate clauses',
      'Confusing "which" vs "that" (restrictive/non-restrictive)',
    ],
    trapPatterns: [
      'Correct-looking but wrong preposition collocation',
      'Plural intervening phrase masking singular subject',
      'Formal-sounding but grammatically wrong construction',
      '"No error" when the sentence is perfectly correct',
    ],
    questionTypeMix: { 'error-spotting': 1.0 },
  },

  {
    id:    'sc',
    topic: 'Sentence Correction',
    upscWeight: 'Very High',
    target: 700,
    upscRelevance: `
      Sentence correction tests the ability to select the grammatically correct
      or contextually best-formed sentence from four options. Common in UPSC,
      SSC CGL, IBPS, and IFoS Compulsory English. All four options must use the
      same vocabulary — only grammar structure distinguishes them.
    `,
    subtopics: [
      'Rewriting sentences in formal register',
      'Correcting faulty parallelism',
      'Eliminating redundancy',
      'Fixing dangling participles',
      'Correcting split infinitives (in formal contexts)',
      'Subject-verb agreement correction',
      'Tense correction in complex sentences',
      'Pronoun-antecedent agreement',
      'Correct use of correlatives (not only...but also, either...or)',
    ],
    trapPatterns: [
      'Two options that both sound correct — one is slightly informal',
      'The "correct" option uses a less-known formal construction',
      'All four options contain errors — the task is to find the LEAST wrong',
    ],
    questionTypeMix: { 'sentence-correction': 0.7, 'mcq': 0.3 },
  },

  {
    id:    'sva',
    topic: 'Subject-Verb Agreement',
    upscWeight: 'High',
    target: 400,
    upscRelevance: `
      Subject-verb agreement errors appear in both error spotting and fill-blank
      formats. UPSC specifically tests edge cases that trap aspirants who know
      the basic rule but miss the exceptions.
    `,
    subtopics: [
      'Correlative conjunctions: neither...nor, either...or, not only...but also',
      'Collective nouns: jury, committee, team, government, staff',
      'Indefinite pronouns: each, every, everyone, nobody, either, neither',
      '"The number of" (singular) vs "a number of" (plural)',
      'Titles, distances, money, time as single units (singular)',
      'Gerunds as subjects (always singular)',
      'Inverted sentences (verb before subject)',
      '"Along with", "together with", "as well as" — do not change the number',
      'Intervening phrases between subject and verb',
      '"One of" takes plural noun but singular verb',
      '"More than one" takes singular verb',
      'Nouns with plural form but singular meaning: news, mathematics, physics',
    ],
    trapPatterns: [
      '"Along with" makes aspirants think the subject is plural',
      'Inverted sentences hide the real subject',
      'Collective nouns trapping aspirants into plural verb choice',
    ],
    questionTypeMix: { 'fill-blank': 0.5, 'error-spotting': 0.35, 'sentence-correction': 0.15 },
  },

  {
    id:    'ten',
    topic: 'Tenses',
    upscWeight: 'High',
    target: 450,
    upscRelevance: `
      UPSC tests tense knowledge via complex sentences with subordinate clauses,
      reported speech transformations, and narrative passages that require
      sequence-of-tenses logic. Simple present/past questions are not asked.
    `,
    subtopics: [
      'Sequence of tenses in complex sentences',
      'Present perfect vs simple past (time markers)',
      'Past perfect in conditional and narrative contexts',
      'Future perfect and future continuous in formal writing',
      'Stative verbs that don\'t take continuous form',
      'Historical present in formal writing',
      'Tense in subordinate clauses after "if", "when", "unless"',
      'Tense shift errors in essays and reports',
      'Habitual past ("used to" vs "would")',
      'Duration-based tenses: "since" vs "for"',
      'Sequence of tenses in reported speech',
    ],
    trapPatterns: [
      '"Have been" vs "had been" in conditionals',
      'Present perfect with "since" vs simple past with "ago"',
      'Stative verbs in progressive form (a classic UPSC trap)',
    ],
    questionTypeMix: { 'fill-blank': 0.5, 'error-spotting': 0.35, 'sentence-correction': 0.15 },
  },

  {
    id:    'art',
    topic: 'Articles',
    upscWeight: 'High',
    target: 300,
    upscRelevance: `
      Article usage is consistently tested in UPSC because Indian-language
      speakers make predictable article errors in formal writing. The bank
      must focus on non-obvious cases, not "a apple" level errors.
    `,
    subtopics: [
      '"the" with unique entities: the sun, the government, the prime minister',
      '"the" with superlatives and ordinals',
      '"the" before institutional names vs no article',
      '"a" vs "an" before acronyms: an IAS officer, a UPSC exam, an MLA',
      '"a" vs "an" before h-words: an hour, a historical event',
      'No article with proper names, languages, sports',
      '"The" with geographical names: the Ganga, the Himalayas',
      'Articles in abstract noun constructions',
      '"A/an" for first mention, "the" for subsequent mention',
      '"The" for class representation: The elephant is a large animal',
    ],
    trapPatterns: [
      '"an" before written acronyms read as vowel sounds (an MLA, an NGO)',
      '"a historical" — the "h" is pronounced, so "a" is correct in formal usage',
      '"the" with titles: "the President of India" vs "President Obama"',
    ],
    questionTypeMix: { 'fill-blank': 0.65, 'error-spotting': 0.35 },
  },

  {
    id:    'pre',
    topic: 'Prepositions',
    upscWeight: 'High',
    target: 400,
    upscRelevance: `
      Preposition errors are among the most penalised in UPSC writing tasks.
      Aspirants who know rules often fail on collocational prepositions because
      these must be memorised — there is no logical rule.
    `,
    subtopics: [
      'Verb + preposition collocations: agree with/to/on, differ from/with/in',
      'Noun + preposition collocations: access to, interest in, reason for',
      'Adjective + preposition: responsible for, aware of, confident in',
      'Compound prepositions: in spite of, on behalf of, with regard to',
      'Prepositions of time: on Monday, in January, at noon',
      'Prepositions of place and direction: at, in, on distinctions',
      '"Between" vs "among" for 2 vs 3+ entities',
      '"Beside" (next to) vs "besides" (in addition to)',
      '"Except" vs "except for" in formal constructions',
      '"Due to" vs "owing to" (attributive vs adverbial)',
    ],
    trapPatterns: [
      'Collocation errors: "married with" vs "married to"',
      '"Oblivious of" vs "oblivious to" — both exist, but contexts differ',
      '"Different from" vs "different than" — formal vs informal',
    ],
    questionTypeMix: { 'fill-blank': 0.55, 'error-spotting': 0.3, 'sentence-correction': 0.15 },
  },

  {
    id:    'vce',
    topic: 'Active & Passive Voice',
    upscWeight: 'High',
    target: 350,
    upscRelevance: `
      Voice conversion is explicitly asked in UPSC Compulsory English. The bank
      must cover all tenses and sentence patterns, not just simple present/past.
      Complex sentences with modal verbs and infinitives are common in UPSC.
    `,
    subtopics: [
      'Simple tenses: active ↔ passive transformation',
      'Continuous and perfect tenses in passive',
      'Modal verbs in passive: can be, must be, should be',
      'Sentences with two objects: direct and indirect passive',
      'Impersonal passive: "It is said that..."',
      'Infinitive passive: "to be done", "to have been done"',
      'Get-passive: "got promoted", "got hurt" in formal writing',
      'Stative verbs that cannot be made passive',
      'Voice in complex sentences with relative clauses',
    ],
    trapPatterns: [
      'Sentences with both direct and indirect objects — which becomes subject?',
      'Modal + passive: wrong tense form (e.g., "must have done" → passive)',
      'Stative verbs incorrectly put in passive',
    ],
    questionTypeMix: { 'voice-conversion': 0.6, 'mcq': 0.2, 'error-spotting': 0.2 },
  },

  {
    id:    'spe',
    topic: 'Direct & Indirect Speech',
    upscWeight: 'High',
    target: 350,
    upscRelevance: `
      Reported speech conversion is a standard question in UPSC and SSC.
      Aspirants regularly fail on: tense backshift rules, pronoun changes,
      time/place adverb changes, and questions in indirect speech.
    `,
    subtopics: [
      'Tense backshift rules: present → past, etc.',
      'Pronoun changes in reported speech',
      'Adverb of time/place changes: now → then, here → there, today → that day',
      'Reporting questions (WH- and yes/no questions)',
      'Reporting commands and requests: told/ordered/requested/asked',
      'Reporting exclamations',
      'No backshift when reporting universal truths or general facts',
      'Mixed tense scenarios: historical past, speech about future',
      'Reporting verbs in formal writing: stated, asserted, claimed, alleged',
    ],
    trapPatterns: [
      'Universal truths do not undergo backshift',
      '"Said to" vs "told" — the distinction aspirants consistently miss',
      'Pronoun shift in third-person indirect speech',
    ],
    questionTypeMix: { 'speech-conversion': 0.55, 'mcq': 0.25, 'error-spotting': 0.2 },
  },

  {
    id:    'mod',
    topic: 'Modifiers',
    upscWeight: 'Medium-High',
    target: 250,
    upscRelevance: `
      Modifier errors are heavily penalised in UPSC writing tasks and regularly
      appear in error spotting. The dangling participle is UPSC's most classic
      grammar trap. Misplaced adverbs ("only", "even", "just") also appear.
    `,
    subtopics: [
      'Dangling participial phrases: "Walking down the road, the trees were tall"',
      'Misplaced participial phrases',
      'Misplaced "only", "even", "just", "nearly", "almost"',
      'Squinting modifiers (ambiguous reference)',
      'Misplaced adverbial clauses',
      'Absolute phrases used incorrectly',
      'Stacked adjectives in wrong order',
    ],
    trapPatterns: [
      'Participial phrase with no logical subject in the main clause',
      '"Only" placed in the wrong position changes the meaning entirely',
    ],
    questionTypeMix: { 'error-spotting': 0.6, 'sentence-correction': 0.4 },
  },

  {
    id:    'par',
    topic: 'Parallelism',
    upscWeight: 'Medium-High',
    target: 250,
    upscRelevance: `
      Parallelism errors appear in essay writing assessments and error-spotting.
      UPSC sentences often have lists or correlatives where one element is in a
      different grammatical form.
    `,
    subtopics: [
      'Parallel structure in lists: verbs, nouns, adjectives',
      'Correlatives: not only...but also, both...and, either...or',
      'Comparative parallelism: "as important as"',
      'Parallel infinitives: "to read, to write, and to analyse"',
      'Faulty parallelism with gerunds vs infinitives in lists',
      'Parallel structure in formal reports and notices',
    ],
    trapPatterns: [
      'List that mixes gerund and infinitive: "reading, writing, and to analyse"',
      'Correlatives that skip the parallel form in the second element',
    ],
    questionTypeMix: { 'error-spotting': 0.55, 'sentence-correction': 0.45 },
  },

  {
    id:    'cnd',
    topic: 'Conditionals',
    upscWeight: 'Medium-High',
    target: 250,
    upscRelevance: `
      Conditional sentences are tested through fill-blank (choosing correct
      verb form) and error spotting. The subjunctive conditional (Type 2/3)
      is the most common UPSC trap — especially "If I were..." vs "If I was..."
    `,
    subtopics: [
      'Type 0: scientific/general truth conditionals',
      'Type 1: real/possible future conditionals',
      'Type 2: unreal present/future (If I were... I would...)',
      'Type 3: unreal past (If I had... I would have...)',
      'Mixed conditionals (Type 2+3 combined)',
      'Formal inversion in conditionals: "Were I to...", "Had she known..."',
      'Unless, provided that, as long as, on condition that',
      'Conditional in formal writing: bureaucratic and administrative English',
    ],
    trapPatterns: [
      '"If I was" vs "If I were" — subjunctive mood is always tested',
      'Type 3 with wrong perfect form: "would have went"',
      'Inverted conditionals that aspirants fail to recognise as conditionals',
    ],
    questionTypeMix: { 'fill-blank': 0.45, 'error-spotting': 0.35, 'sentence-correction': 0.2 },
  },

  {
    id:    'nfv',
    topic: 'Non-finite Verbs',
    upscWeight: 'High',
    target: 300,
    upscRelevance: `
      Non-finite verbs (gerunds, infinitives, participles) create complex
      interactions that aspirants find difficult. These appear in error spotting
      and fill-blank. Gerund/infinitive choice after specific verbs is a core
      exam pattern.
    `,
    subtopics: [
      'Verbs followed by gerund only: enjoy, avoid, consider, deny, finish',
      'Verbs followed by infinitive only: decide, agree, refuse, want, expect',
      'Verbs followed by both with meaning change: stop, forget, remember, try',
      'Perfect infinitive: "He appears to have left"',
      'Perfect participle: "Having submitted the report, she left"',
      'Passive gerund: "being told", "having been told"',
      'Gerund as subject: "Governing efficiently requires..."',
      'Gerund after prepositions: "interested in going"',
      'Split infinitive in formal contexts',
      '"Used to" (past habit) vs "be used to" + gerund (accustomed)',
    ],
    trapPatterns: [
      '"Stop to do" (stopped in order to do) vs "stop doing" (ceased doing)',
      '"Remember doing" (past memory) vs "remember to do" (future task)',
      '"Used to" vs "be used to" — the classic UPSC confusion',
    ],
    questionTypeMix: { 'fill-blank': 0.5, 'error-spotting': 0.35, 'sentence-correction': 0.15 },
  },

  {
    id:    'cla',
    topic: 'Clauses & Connectors',
    upscWeight: 'High',
    target: 300,
    upscRelevance: `
      Clause and connector questions test formal writing skills directly
      relevant to UPSC essay and précis. Logical connectors (however, therefore,
      moreover) and relative clause structures are core.
    `,
    subtopics: [
      'Relative clauses: who/whom/whose/which/that — restrictive vs non-restrictive',
      'Noun clauses as subjects and objects',
      'Adverbial clauses: reason (because/since/as), concession (although/though)',
      'Conditional clauses: if/unless/provided that',
      'Temporal clauses: when/while/as/after/before',
      'Formal connectors: however, therefore, consequently, nonetheless',
      'Discourse markers in formal writing: firstly, in addition, in contrast',
      '"So...that" and "such...that" constructions',
      'Ellipsis in subordinate clauses',
      'Correlative clauses: the more...the more',
    ],
    trapPatterns: [
      '"However" vs "but" — cannot start a sentence in the same way',
      'Comma splice: joining two independent clauses with only a comma',
      '"Because" vs "because of" — clause vs phrase',
    ],
    questionTypeMix: { 'fill-blank': 0.4, 'sentence-correction': 0.35, 'mcq': 0.25 },
  },

  {
    id:    'voc',
    topic: 'Vocabulary Usage',
    upscWeight: 'Medium-High',
    target: 250,
    upscRelevance: `
      Formal vocabulary questions test word selection in administrative/academic
      writing contexts. Focus on pairs that aspirants confuse: affect/effect,
      principle/principal, complement/compliment, and UPSC-relevant bureaucratic
      vocabulary.
    `,
    subtopics: [
      'Confusable pairs: affect/effect, practice/practise, principal/principle',
      'Formal register words: therefore/thus/hence, procure/obtain/acquire',
      'Bureaucratic vocabulary: pursuant to, in pursuance of, forthwith',
      'Word in context (sense that fits best in a formal sentence)',
      'Redundant word pairs: "free gift", "end result", "past history"',
      'Correct collocation: "make a decision" not "take a decision" (in formal)',
      'Confusable verbs: lie/lay, rise/raise, sit/set',
      'Confusable adjectives: continual/continuous, alternate/alternative',
    ],
    trapPatterns: [
      '"Effect" as a verb (to effect change) vs "affect" — both can be verbs',
      '"Complement" vs "compliment" in formal writing contexts',
    ],
    questionTypeMix: { 'fill-blank': 0.6, 'mcq': 0.3, 'sentence-correction': 0.1 },
  },

  {
    id:    'idm',
    topic: 'Idioms & Phrases',
    upscWeight: 'Medium',
    target: 250,
    upscRelevance: `
      UPSC tests idiomatic usage in context — selecting the idiom that best
      completes a formal sentence, or identifying an incorrectly used idiom.
      Focus on idioms that appear in formal writing, not casual speech.
    `,
    subtopics: [
      'Idioms used in formal/governmental writing',
      'Latin-origin phrases: ipso facto, prima facie, sub judice, vis-à-vis',
      'Commonly confused idioms: "on the mend" vs "on the blink"',
      'Phrasal verbs in formal contexts: "take up", "put forward", "carry out"',
      'Prepositional phrases: "in the light of", "by virtue of", "with a view to"',
      'Fixed expressions in administrative English: "at the earliest", "as per"',
    ],
    trapPatterns: [
      'Latin phrases used out of context (sub judice used for a closed case)',
      'Prepositional idioms with wrong preposition: "at" vs "in" vs "on"',
    ],
    questionTypeMix: { 'fill-blank': 0.6, 'mcq': 0.4 },
  },

  {
    id:    'mix',
    topic: 'Mixed UPSC-style',
    upscWeight: 'Very High',
    target: 400,
    upscRelevance: `
      Mixed sets simulate the actual UPSC Compulsory English paper format where
      multiple grammar concepts appear in a single passage or question set.
      These are the most realistic practice questions in the bank.
    `,
    subtopics: [
      'Passage-based error spotting (5–8 sentences from a formal passage)',
      'Integrated grammar: SVA + tense + modifier in one sentence',
      'UPSC Mains pattern: 200-word passage with 5 grammar questions',
      'Administrative English patterns: government notices, circulars',
      'Academic English: research abstracts, report language',
    ],
    trapPatterns: [
      'Multiple plausible errors in the same sentence',
      'No-error options that test confidence in correct sentences',
    ],
    questionTypeMix: { 'error-spotting': 0.45, 'sentence-correction': 0.3, 'fill-blank': 0.15, 'mcq': 0.1 },
  },
]

export default CATEGORY_META
