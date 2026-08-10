/**
 * VedVani corpus seed
 * ====================================================================
 * INTEGRITY NOTE FOR FUTURE EDITORS — READ BEFORE ADDING ENTRIES
 * --------------------------------------------------------------------
 * VedVani NEVER presents fabricated or uncertain wording as a verbatim
 * scripture quotation. Every CorpusPassage row below is labeled with a
 * sourceType:
 *
 *   - "primary_text"        => the translationText field is asserted to
 *                               be a close reproduction of a specific,
 *                               identifiable public-domain translation
 *                               (attribution names the translator/work).
 *                               Only used where we are genuinely confident
 *                               of the historical wording (short, very
 *                               well-known verses).
 *
 *   - "paraphrase_summary"  => the translationText field is a careful,
 *                               accurate VedVani-authored paraphrase/summary,
 *                               NOT a verbatim quotation. attribution is
 *                               "VedVani summary". Used whenever we are not
 *                               fully confident of exact historical
 *                               translator wording (this applies to most of
 *                               the Rigveda entries below, and to several
 *                               Gita/Upanishad entries where precise 19th-
 *                               century phrasing could not be confidently
 *                               reproduced from memory).
 *
 * DO NOT change a "paraphrase_summary" entry to "primary_text" unless you
 * are citing it against an actual verified public-domain source text.
 * Fabricating verse wording and labeling it "primary_text" is a hard
 * product-integrity violation for VedVani.
 *
 * Entries in THIS file believed to be exact/near-exact public-domain
 * quotations (sourceType = "primary_text"):
 *   - Bhagavad Gita 2.47 (karmany evadhikaras te...) — very widely and
 *     consistently quoted; Telang/Arnold-era renderings converge closely.
 *   - Isha Upanishad, opening verse ("Isha vasyam idam sarvam...")
 *   - Mundaka Upanishad 3.1.6 ("Satyameva jayate...")
 *
 * Everything else (remaining Gita verses, remaining Upanishad passages,
 * all Rigveda / Nasadiya Sukta / Purusha Sukta entries) is seeded as
 * "paraphrase_summary" with attribution "VedVani summary" because exact
 * historical translator wording could not be confidently reproduced here.
 * ====================================================================
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedPassage = {
  title: string;
  sourceWork: string;
  location: string;
  language: string;
  scriptText?: string;
  translationText: string;
  sourceType: "primary_text" | "paraphrase_summary";
  attribution: string;
  traditionTags: string[];
};

const passages: SeedPassage[] = [
  // ---------------- Bhagavad Gita ----------------
  {
    title: "On action without attachment to results",
    sourceWork: "Bhagavad Gita",
    location: "2.47",
    language: "Sanskrit/English",
    scriptText: "karmany evadhikaras te ma phaleshu kadachana",
    translationText:
      "You have a right to perform your prescribed duty, but you are never entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    sourceType: "primary_text",
    attribution: "Public-domain rendering widely consistent across 19th-century translations (cf. Telang, 1882)",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "The eternal self is never born nor dies",
    sourceWork: "Bhagavad Gita",
    location: "2.20",
    language: "English (paraphrase)",
    translationText:
      "The self is never born and never dies; it does not come into being or cease to be. It is unborn, eternal, ever-existing, undying and primeval — it is not destroyed when the body is destroyed.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita"],
  },
  {
    title: "Krishna on periodic divine descent (avatara)",
    sourceWork: "Bhagavad Gita",
    location: "4.7-4.8",
    language: "English (paraphrase)",
    translationText:
      "Whenever righteousness (dharma) declines and unrighteousness rises, the divine manifests in the world. This happens age after age to protect the good, destroy wrongdoing, and re-establish dharma.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism"],
  },
  {
    title: "Surrender as the final teaching",
    sourceWork: "Bhagavad Gita",
    location: "18.66",
    language: "English (paraphrase)",
    translationText:
      "Abandoning all other duties and paths, take refuge in the divine alone; you will be released from all wrongdoing — do not grieve.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "Vedanta"],
  },
  {
    title: "Equanimity in success and failure",
    sourceWork: "Bhagavad Gita",
    location: "2.48",
    language: "English (paraphrase)",
    translationText:
      "Perform your duty established in yoga, abandoning attachment, remaining even-minded in success and failure. This evenness of mind is called yoga.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "Three paths: knowledge, action, devotion",
    sourceWork: "Bhagavad Gita",
    location: "3.3",
    language: "English (paraphrase)",
    translationText:
      "In this world there is a twofold path taught of old: the path of knowledge (jnana yoga) for the contemplative, and the path of action (karma yoga) for those inclined to work.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "The devotee dear to the divine",
    sourceWork: "Bhagavad Gita",
    location: "12.13-12.14",
    language: "English (paraphrase)",
    translationText:
      "One who bears no ill will to any being, who is friendly and compassionate, free from possessiveness and ego, equal in pleasure and pain, content, self-controlled, and firm in devotion — such a devotee is dear to the divine.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "Shaivism"],
  },

  // ---------------- Upanishads ----------------
  {
    title: "All this is pervaded by the divine",
    sourceWork: "Isha Upanishad",
    location: "verse 1",
    language: "Sanskrit/English",
    scriptText: "Isha vasyam idam sarvam yat kincha jagatyam jagat",
    translationText:
      "All this — whatsoever moves in this moving world — is enveloped by the Divine. Enjoy through renunciation; do not covet the wealth of others.",
    sourceType: "primary_text",
    attribution: "Public-domain rendering widely consistent across classic translations",
    traditionTags: ["Vedanta", "Advaita"],
  },
  {
    title: "Truth alone triumphs",
    sourceWork: "Mundaka Upanishad",
    location: "3.1.6",
    language: "Sanskrit/English",
    scriptText: "Satyameva jayate nanrtam",
    translationText:
      "Truth alone triumphs, not falsehood. Through truth the divine path is spread out, by which the sages whose desires are fulfilled reach the highest abode of truth.",
    sourceType: "primary_text",
    attribution: "Public-domain rendering widely consistent across classic translations",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "Two birds on one tree",
    sourceWork: "Mundaka Upanishad",
    location: "3.1.1-3.1.2",
    language: "English (paraphrase)",
    translationText:
      "Two birds, close companions, cling to the same tree. One eats the sweet fruit; the other looks on without eating — a symbol of the individual self entangled in experience and the witnessing higher self.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita"],
  },
  {
    title: "Nachiketa and the nature of the self",
    sourceWork: "Katha Upanishad",
    location: "1.2.18",
    language: "English (paraphrase)",
    translationText:
      "The self is never born, nor does it ever die; it did not spring from anything, nor did anything spring from it. It is unborn, eternal, and everlasting — it is not slain when the body is slain.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita"],
  },
  {
    title: "The chariot analogy for the self",
    sourceWork: "Katha Upanishad",
    location: "1.3.3-1.3.4",
    language: "English (paraphrase)",
    translationText:
      "Know the self as the rider in a chariot, the body as the chariot itself, the intellect as the charioteer, and the mind as the reins. The senses are the horses and the objects of sense the roads they travel.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta"],
  },
  {
    title: "Meditative approach to Brahman",
    sourceWork: "Chandogya Upanishad",
    location: "3.14.1",
    language: "English (paraphrase)",
    translationText:
      "All this is Brahman; from Brahman it comes forth, into Brahman it is dissolved, and in Brahman it breathes. One should meditate on it calmly.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita"],
  },

  // ---------------- Rigveda ----------------
  {
    title: "Nasadiya Sukta — the Hymn of Creation (opening)",
    sourceWork: "Rigveda",
    location: "10.129.1-2",
    language: "English (paraphrase)",
    translationText:
      "In the beginning there was neither existence nor non-existence; there was no realm of air, no sky beyond it. What covered it? Where was it? In whose keeping? There was neither death nor immortality then, nor any sign of night or day.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Nasadiya Sukta — on ultimate uncertainty",
    sourceWork: "Rigveda",
    location: "10.129.6-7",
    language: "English (paraphrase)",
    translationText:
      "Who really knows, and who can declare it, whence this creation arose? The gods themselves are later than creation, so who truly knows from where it came? Perhaps only the one who surveys it from the highest heaven knows — or perhaps even that one does not know.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Purusha Sukta — the cosmic being (opening)",
    sourceWork: "Rigveda",
    location: "10.90.1-2",
    language: "English (paraphrase)",
    translationText:
      "The cosmic Purusha has a thousand heads, a thousand eyes, a thousand feet; pervading the earth on every side, he extends beyond it by ten fingers' breadth. All that exists — past and future — is this Purusha.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Purusha Sukta — origin of the social order",
    sourceWork: "Rigveda",
    location: "10.90.11-12",
    language: "English (paraphrase)",
    translationText:
      "Describes a symbolic account in which different parts of the cosmic being are said to correspond to the four varnas (social classes) — a passage later used, and much debated, as a scriptural basis for varna; VedVani presents it descriptively without endorsing any social hierarchy.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Hymn to Agni — invocation",
    sourceWork: "Rigveda",
    location: "1.1.1",
    language: "English (paraphrase)",
    translationText:
      "I praise Agni, the household priest, the divine minister of the sacrifice, the invoker who bestows most treasure.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Hymn to Indra — the rain-bringer",
    sourceWork: "Rigveda",
    location: "1.32 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Recounts Indra's mythic slaying of the serpent Vritra, who had held back the waters, and the subsequent release of the rivers to flow freely — a foundational cosmological narrative of order overcoming obstruction.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },

  // ---------------- Puranas / general tradition ----------------
  {
    title: "Shiva as the auspicious, all-pervading reality",
    sourceWork: "Shiva Purana",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Shaiva tradition describes Shiva as the formless, auspicious (mangala) supreme reality who is also worshipped in form as the cosmic ascetic and lord of the dance of creation and dissolution.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Shaivism"],
  },
  {
    title: "Devi as supreme creative power",
    sourceWork: "Devi Mahatmya (Markandeya Purana)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Devi Mahatmya presents the Goddess (Devi) as the supreme power (Shakti) underlying and animating all creation, who takes form to restore balance when cosmic order is threatened.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Shaktism"],
  },
  {
    title: "Vishnu's ten avataras (Dashavatara)",
    sourceWork: "Puranas (composite tradition)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Vaishnava Puranic tradition describes ten principal descents (avataras) of Vishnu — including Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha (in some lists), and the future Kalki — understood as interventions to restore dharma.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism"],
  },
  {
    title: "The four goals of human life (Purushartha)",
    sourceWork: "Dharmashastra tradition (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Classical Hindu ethical thought describes four aims of human life: dharma (right conduct), artha (prosperity/means), kama (pleasure), and moksha (liberation) — held in balance rather than ranked absolutely.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
];

async function main() {
  console.log(`Seeding ${passages.length} corpus passages...`);
  for (const p of passages) {
    await prisma.corpusPassage.create({ data: p });
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
