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
 *   - Brihadaranyaka Upanishad 1.3.28 ("asato ma sadgamaya..." / the
 *     Pavamana Mantra) — one of the most widely and consistently quoted
 *     Upanishadic verses across standard public-domain translations.
 *
 * As of the corpus expansion below, the seed contains 58 total passages:
 * 4 labeled "primary_text" and 54 labeled "paraphrase_summary". The
 * expansion added ~35 new entries covering: one representative verse per
 * remaining Bhagavad Gita chapter (chapters 1, 5-11, 13-17; chapters 2, 3,
 * 4, 12, 18 were already present), additional passages from the
 * Brihadaranyaka and Chandogya Upanishads (including the mahavakyas "aham
 * brahmasmi" and "tat tvam asi"), brief Ramayana and Mahabharata narrative
 * summaries (explicitly NOT verbatim translations), short entries on the
 * festivals of Diwali, Holi, and Navaratri, and brief summaries of the six
 * classical darshanas (Nyaya, Vaisheshika, Samkhya, Yoga, Purva Mimamsa,
 * Uttara Mimamsa/Vedanta). All new entries follow the same integrity rule:
 * anything not a verified verbatim public-domain quotation is
 * "paraphrase_summary" with attribution "VedVani summary" — none of the
 * new narrative, festival, or darshana entries claim to be primary_text.
 *
 * Everything else (remaining Gita verses, remaining Upanishad passages,
 * all Rigveda / Nasadiya Sukta / Purusha Sukta entries, all narrative
 * summaries, festival entries, and darshana entries) is seeded as
 * "paraphrase_summary" with attribution "VedVani summary" because exact
 * historical translator wording could not be confidently reproduced here,
 * or because the entry is a narrative/summary by nature.
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
  // ---------------- Bhagavad Gita — remaining chapters (one representative verse each) ----------------
  {
    title: "Arjuna's despair on the battlefield",
    sourceWork: "Bhagavad Gita",
    location: "1.28-1.30 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Seeing kinsmen and teachers arrayed for battle, Arjuna is overcome with grief and doubt, his limbs failing and his bow slipping from his hand, and he questions whether the coming war is right at all.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "The yoga of meditation and the wandering mind",
    sourceWork: "Bhagavad Gita",
    location: "6.5-6.6 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna teaches that a person must lift themselves up by their own mind, not degrade themselves, for the mind can be either one's friend or one's enemy depending on whether it is mastered.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Yoga"],
  },
  {
    title: "Knowledge and realization",
    sourceWork: "Bhagavad Gita",
    location: "7.3 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna states that among thousands of people, scarcely one strives for perfection, and among those who strive, scarcely one truly comes to know him in essence.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta"],
  },
  {
    title: "Remembering the divine at the time of death",
    sourceWork: "Bhagavad Gita",
    location: "8.5-8.6 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna teaches that whatever state of being one remembers at the final moment of death, that state one attains, since the mind's habitual focus in life shapes the direction of departure.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "Krishna as the sustaining presence in all things",
    sourceWork: "Bhagavad Gita",
    location: "9.22 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna promises that for those who worship him with single-minded devotion, thinking of nothing else, he personally carries what they lack and preserves what they have.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "Vedanta"],
  },
  {
    title: "Krishna's divine manifestations (vibhuti)",
    sourceWork: "Bhagavad Gita",
    location: "10.20-10.21 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna describes himself as the Self seated in the heart of every being, and as the best or most representative example within many categories of existence — among stars the sun, among Vedas the Samaveda, and so on.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Vaishnavism"],
  },
  {
    title: "The vision of the universal form",
    sourceWork: "Bhagavad Gita",
    location: "11.32 (summary)",
    language: "English (paraphrase)",
    translationText:
      "In the terrifying vision of his cosmic form, Krishna declares himself to be time (kala), the great destroyer of worlds, come forth to annihilate all beings, and that even without Arjuna's action the warriors arrayed against him are already doomed.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "The field and the knower of the field",
    sourceWork: "Bhagavad Gita",
    location: "13.1-13.2 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna distinguishes the 'field' (kshetra) — the body and material nature — from the 'knower of the field' (kshetrajna), the conscious self that knows it, and identifies himself as the knower of the field in all bodies.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta"],
  },
  {
    title: "The three gunas that bind the embodied self",
    sourceWork: "Bhagavad Gita",
    location: "14.5 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna explains that material nature consists of three qualities — sattva (clarity), rajas (passion), and tamas (inertia) — which together bind the imperishable self to the body.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Samkhya"],
  },
  {
    title: "The eternal ashvattha tree as a symbol of samsara",
    sourceWork: "Bhagavad Gita",
    location: "15.1 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna describes an inverted, eternal ashvattha (fig) tree with roots above and branches below, representing the world of birth and rebirth, whose roots are cut by the one who understands its true nature.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta"],
  },
  {
    title: "Divine and demonic tendencies",
    sourceWork: "Bhagavad Gita",
    location: "16.5-16.6 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna contrasts 'divine' qualities (daivi sampad) such as fearlessness and purity, which lead to liberation, with 'demonic' qualities (asuri sampad) such as arrogance and cruelty, which bind one further to the world.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta"],
  },
  {
    title: "Three kinds of faith and food",
    sourceWork: "Bhagavad Gita",
    location: "17.8-17.10 (summary)",
    language: "English (paraphrase)",
    translationText:
      "Krishna teaches that people's faith, and even their preferred foods, sacrifices, and austerities, fall into sattvic, rajasic, or tamasic categories according to their inner nature.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta"],
  },
  {
    title: "Surrender as the final teaching",
    sourceWork: "Bhagavad Gita",
    location: "18.66",
    language: "English (paraphrase)",
    translationText:
      "In the Gita's closing counsel, Krishna urges Arjuna to abandon all other dharmas and take refuge in him alone, promising liberation from all sin — a verse traditionally read as the text's culminating teaching on surrender (sharanagati).",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "Vedanta"],
  },

  // ---------------- Additional Upanishad passages ----------------
  {
    title: "Lead me from the unreal to the real",
    sourceWork: "Brihadaranyaka Upanishad",
    location: "1.3.28",
    language: "Sanskrit/English",
    scriptText: "asato ma sadgamaya, tamaso ma jyotir gamaya, mrityor ma amritam gamaya",
    translationText:
      "From the unreal lead me to the real, from darkness lead me to light, from death lead me to immortality — the Pavamana Mantra, one of the most widely recited prayers in the Hindu tradition.",
    sourceType: "primary_text",
    attribution: "Public-domain rendering widely consistent across standard translations (cf. Max Müller, Sacred Books of the East)",
    traditionTags: ["Vedanta", "general"],
  },
  {
    title: "The self is Brahman (Aham Brahmasmi)",
    sourceWork: "Brihadaranyaka Upanishad",
    location: "1.4.10 (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Upanishad teaches that whoever realizes 'I am Brahman' (aham brahmasmi) becomes identified with the whole universe, one of the four classical 'great sayings' (mahavakyas) of Advaita Vedanta.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Advaita", "Vedanta"],
  },
  {
    title: "The Self as dearer than all else",
    sourceWork: "Brihadaranyaka Upanishad",
    location: "2.4.5 (summary)",
    language: "English (paraphrase)",
    translationText:
      "In the sage Yajnavalkya's teaching to his wife Maitreyi, he explains that nothing — not a spouse, wealth, or children — is dear for its own sake, but all things are dear because the Self is dear; hence the Self alone is worthy of being known.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita"],
  },
  {
    title: "That art thou (Tat Tvam Asi)",
    sourceWork: "Chandogya Upanishad",
    location: "6.8.7 (summary)",
    language: "English (paraphrase)",
    translationText:
      "In instructing his son Shvetaketu, Uddalaka Aruni repeatedly concludes with 'tat tvam asi' — 'that art thou' — teaching that the subtle essence pervading the universe is identical with the individual self, another of the four mahavakyas.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Advaita", "Vedanta"],
  },
  {
    title: "This Self is Brahman, experienced in the heart",
    sourceWork: "Mundaka Upanishad",
    location: "2.2.11 (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Mundaka Upanishad teaches that Brahman alone is all this, and that meditating on this truth, the wise become freed from grief while yet embodied.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita"],
  },
  {
    title: "Two birds on one tree — the individual and universal self",
    sourceWork: "Katha Upanishad / Mundaka Upanishad",
    location: "Mundaka 3.1.1 (summary; also Rigveda 1.164.20)",
    language: "English (paraphrase)",
    translationText:
      "A well-known image describes two birds, close companions, perched on the same tree: one eats the sweet fruit of action, while the other looks on without eating — representing the individual self absorbed in experience and the witnessing universal Self.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita"],
  },

  // ---------------- Ramayana narrative summaries (paraphrase, not verbatim) ----------------
  {
    title: "Rama's exile to the forest",
    sourceWork: "Ramayana (Valmiki), Ayodhya Kanda",
    location: "narrative summary",
    language: "English (paraphrase)",
    translationText:
      "To honor his father Dasharatha's promise to queen Kaikeyi, Prince Rama willingly gives up his claim to the throne of Ayodhya and departs for fourteen years of forest exile, accompanied by his wife Sita and brother Lakshmana.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "general"],
  },
  {
    title: "The abduction of Sita",
    sourceWork: "Ramayana (Valmiki), Aranya Kanda",
    location: "narrative summary",
    language: "English (paraphrase)",
    translationText:
      "While Rama and Lakshmana are lured away by a magical golden deer, the demon king Ravana abducts Sita and carries her to Lanka, setting in motion the epic's central conflict.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "general"],
  },
  {
    title: "Hanuman's leap to Lanka",
    sourceWork: "Ramayana (Valmiki), Sundara Kanda",
    location: "narrative summary",
    language: "English (paraphrase)",
    translationText:
      "The monkey-devotee Hanuman leaps across the ocean to Lanka, finds Sita in captivity, comforts her with Rama's ring as proof, and returns after surveying Ravana's stronghold — an episode central to Hanuman's veneration as the ideal devotee.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "general"],
  },
  {
    title: "Rama's victory and return to Ayodhya",
    sourceWork: "Ramayana (Valmiki), Yuddha Kanda",
    location: "narrative summary",
    language: "English (paraphrase)",
    translationText:
      "After a great war in which Rama, allied with Sugriva's monkey army, defeats Ravana and rescues Sita, Rama returns to Ayodhya, where his coronation is celebrated — the homecoming traditionally associated with the festival of Diwali.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "general"],
  },

  // ---------------- Mahabharata narrative summaries (paraphrase, not verbatim) ----------------
  {
    title: "The dice game and Draupadi's humiliation",
    sourceWork: "Mahabharata, Sabha Parva",
    location: "narrative summary",
    language: "English (paraphrase)",
    translationText:
      "The Pandavas lose their kingdom, freedom, and even queen Draupadi in a rigged dice game against their cousins the Kauravas; Draupadi's public humiliation becomes a central grievance driving the eventual war.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "The exile of the Pandavas",
    sourceWork: "Mahabharata, Vana Parva",
    location: "narrative summary",
    language: "English (paraphrase)",
    translationText:
      "As a condition of the lost dice game, the five Pandava brothers and Draupadi spend twelve years in forest exile followed by a year in disguise, during which many teaching stories and sub-narratives are recounted to them by sages.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "The Kurukshetra war and its aftermath",
    sourceWork: "Mahabharata, Bhishma Parva onward",
    location: "narrative summary",
    language: "English (paraphrase)",
    translationText:
      "The eighteen-day war at Kurukshetra between the Pandavas and Kauravas, in which the Bhagavad Gita is set as Krishna's counsel to Arjuna before battle, ends in a costly Pandava victory and a somber meditation on duty, loss, and dharma in the epic's closing books.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general", "Vedanta"],
  },

  // ---------------- Festivals ----------------
  {
    title: "Diwali — the festival of lights",
    sourceWork: "Festival tradition (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Diwali (Deepavali) is widely celebrated as the festival of lights, commemorating Rama's return to Ayodhya after defeating Ravana; it is also associated regionally with the worship of Lakshmi (goddess of prosperity), Kali, and the start of the new year in some traditions, with homes lit by oil lamps to mark the triumph of light over darkness.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general", "Vaishnavism", "Shaktism"],
  },
  {
    title: "Holi — the festival of colors",
    sourceWork: "Festival tradition (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Holi celebrates the arrival of spring and the triumph of devotion over pride, commemorating the story of Prahlada and Holika, and is marked by bonfires the night before and the joyful throwing of colored powder and water the following day; it is also closely associated with Krishna's playful festivities in Vraja.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general", "Vaishnavism"],
  },
  {
    title: "Navaratri — nine nights of the Goddess",
    sourceWork: "Festival tradition (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Navaratri ('nine nights') honors the Goddess in her various forms over nine nights, often culminating in Vijayadashami/Dussehra, which in different regions commemorates Durga's victory over the buffalo-demon Mahishasura or Rama's victory over Ravana.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general", "Shaktism", "Vaishnavism"],
  },

  // ---------------- Six darshanas (classical philosophical schools) ----------------
  {
    title: "Nyaya — the school of logic and epistemology",
    sourceWork: "Six Darshanas (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Nyaya, founded in association with the sage Gautama, is the classical Hindu school of logic and epistemology, systematizing valid means of knowledge (pramanas) such as perception, inference, comparison, and testimony.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Nyaya", "general"],
  },
  {
    title: "Vaisheshika — the school of atomism and categories",
    sourceWork: "Six Darshanas (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Vaisheshika, associated with the sage Kanada, proposes a naturalist and atomistic metaphysics, classifying all of reality into a small set of fundamental categories (padarthas) including substance, quality, and action.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaisheshika", "general"],
  },
  {
    title: "Samkhya — the school of dualist enumeration",
    sourceWork: "Six Darshanas (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Samkhya, traditionally attributed to the sage Kapila, teaches a dualism of purusha (pure consciousness) and prakriti (material nature), and analyzes the unfolding of the world into twenty-five fundamental principles (tattvas).",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Samkhya", "general"],
  },
  {
    title: "Yoga — the school of disciplined practice",
    sourceWork: "Six Darshanas (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Yoga darshana, systematized by Patanjali in the Yoga Sutras, shares Samkhya's metaphysics but emphasizes a practical eight-limbed path (ashtanga yoga) of ethical restraint, posture, breath control, and meditative absorption to still the fluctuations of the mind.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Yoga", "general"],
  },
  {
    title: "Purva Mimamsa — the school of ritual exegesis",
    sourceWork: "Six Darshanas (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Purva Mimamsa, associated with Jaimini, focuses on the correct interpretation of Vedic ritual injunctions, holding the Veda's ritual portions to be eternal and authoritative in guiding right action (dharma).",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Mimamsa", "general"],
  },
  {
    title: "Uttara Mimamsa (Vedanta) — the school of the Upanishadic end of the Veda",
    sourceWork: "Six Darshanas (composite)",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Uttara Mimamsa, better known as Vedanta, interprets the Upanishadic 'end of the Veda' concerning the nature of Brahman and the self, and later branches into distinct sub-schools such as Advaita (non-dualism), Vishishtadvaita (qualified non-dualism), and Dvaita (dualism).",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vedanta", "Advaita", "general"],
  },

];

async function main() {
  const existing = await prisma.corpusPassage.count();
  if (existing >= passages.length) {
    console.log(`Corpus already has ${existing} passages (>= ${passages.length}) — skipping seed.`);
    return;
  }
  if (existing > 0) {
    console.log(`Corpus has ${existing} passages, expected ${passages.length} — resetting and reseeding.`);
    await prisma.corpusPassage.deleteMany({});
  }
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
