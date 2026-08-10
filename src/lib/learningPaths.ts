/**
 * Static "learning path" definitions. Rather than hardcoding CorpusPassage
 * ids (which are generated at seed time and not knowable ahead of time),
 * each path lists substrings to match against real CorpusPassage titles
 * via a Prisma `contains` query at request time. See prisma/seed.ts for
 * the actual titles these were derived from.
 */
export type LearningPath = {
  slug: string;
  title: string;
  description: string;
  titleMatches: string[];
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: "intro-to-the-gita",
    title: "Introduction to the Bhagavad Gita",
    description:
      "A first walk through the Gita's core teachings: Arjuna's crisis, action without attachment, the eternal self, and surrender.",
    titleMatches: [
      "Arjuna's despair on the battlefield",
      "On action without attachment to results",
      "The eternal self is never born nor dies",
      "Surrender as the final teaching",
      "Three paths: knowledge, action, devotion",
    ],
  },
  {
    slug: "what-are-the-vedas",
    title: "What are the Vedas?",
    description:
      "An introduction to the Vedic hymns — creation, the cosmic being, and invocations to Agni and Indra.",
    titleMatches: [
      "Nasadiya Sukta",
      "Purusha Sukta",
      "Hymn to Agni",
      "Hymn to Indra",
    ],
  },
  {
    slug: "understanding-the-self-upanishads",
    title: "Understanding the Self — the Upanishads",
    description:
      "Core Upanishadic teachings on the nature of the self and its relationship to Brahman.",
    titleMatches: [
      "Two birds on one tree",
      "Nachiketa and the nature of the self",
      "The chariot analogy for the self",
      "The self is Brahman (Aham Brahmasmi)",
      "That art thou (Tat Tvam Asi)",
      "This Self is Brahman, experienced in the heart",
    ],
  },
  {
    slug: "six-darshanas",
    title: "The Six Darshanas",
    description:
      "A survey of the six classical schools of Hindu philosophy: Nyaya, Vaisheshika, Samkhya, Yoga, Purva Mimamsa, and Uttara Mimamsa (Vedanta).",
    titleMatches: [
      "Nyaya — the school of logic and epistemology",
      "Vaisheshika — the school of atomism and categories",
      "Samkhya — the school of dualist enumeration",
      "Yoga — the school of disciplined practice",
      "Purva Mimamsa — the school of ritual exegesis",
      "Uttara Mimamsa (Vedanta)",
    ],
  },
  {
    slug: "epics-ramayana-mahabharata",
    title: "The Epics: Ramayana and Mahabharata",
    description:
      "Key episodes from the two great Hindu epics — Rama's exile and return, and the events leading to the Kurukshetra war.",
    titleMatches: [
      "Rama's exile to the forest",
      "The abduction of Sita",
      "Hanuman's leap to Lanka",
      "Rama's victory and return to Ayodhya",
      "The dice game and Draupadi's humiliation",
      "The exile of the Pandavas",
      "The Kurukshetra war and its aftermath",
    ],
  },
];
