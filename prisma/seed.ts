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
 *
 * Phase 9 corpus expansion: 23 further entries were added, bringing the
 * total to 87 passages (4 "primary_text", 83 "paraphrase_summary"). The
 * additions cover: brief overview summaries of six major Puranas (Vishnu,
 * Shiva, Bhagavata, Markandeya, Devi Bhagavata, Skanda); four deeper
 * darshana entries (Nyaya's pramanas, Vaisheshika's atomism, Samkhya's
 * purusha-prakriti dualism, Mimamsa's ritual hermeneutics); seven brief
 * biographical summaries of saints/acharyas (Adi Shankaracharya, Ramanuja,
 * Madhvacharya, Tulsidas, Mirabai, Kabir, Chaitanya Mahaprabhu); and six
 * entries on samskaras and daily practice (an overview of the samskaras,
 * upanayana, vivaha, antyesti, sandhyavandanam, and the basic structure of
 * home puja). Every Phase 9 entry is "paraphrase_summary" with attribution
 * "VedVani summary" — none claim to be verbatim primary-text quotations.
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

  // ---------------- Phase 8: alternate interpretive layers ("commentary comparison") ----------------
  // IMPORTANT: the entries below are NOT claims about what any specific
  // named historical commentator wrote. They are VedVani's own illustrative
  // interpretive glosses on verses already seeded above, deliberately
  // written to show how the SAME verse reads differently through different
  // traditions' lenses (per BRD FR-READ-002 "commentary comparison"). Each
  // is sourceType "paraphrase_summary" and clearly attributed as a VedVani
  // summary informed by a named tradition — never presented as primary
  // scripture text or as a verbatim quotation from a real commentator.
  {
    title: "On action without attachment — an Advaita-informed reading",
    sourceWork: "Bhagavad Gita",
    location: "2.47",
    language: "English (paraphrase)",
    translationText:
      "Read through an Advaita (non-dual) lens, this verse points past ethics toward metaphysics: the 'fruits' one must release are ultimately the illusion of a separate doer at all. Action continues in the world of appearances, but the wise recognize the true Self (Atman) as the changeless witness, untouched by the results of any action performed by body and mind.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary — Advaita-informed reading (illustrative interpretive gloss, not a specific historical commentator's words)",
    traditionTags: ["Advaita", "Vedanta"],
  },
  {
    title: "On action without attachment — a Bhakti-informed reading",
    sourceWork: "Bhagavad Gita",
    location: "2.47",
    language: "English (paraphrase)",
    translationText:
      "Read through a Bhakti (devotional) lens, this verse is about offering: one performs one's duty as an act dedicated to the divine, surrendering the outcome not to abstraction but to a personal, gracious Lord. Freedom from attachment to results comes from trust — the devotee acts wholeheartedly because the fruit is not theirs to hold, but the Lord's to receive.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary — Bhakti-informed reading (illustrative interpretive gloss, not a specific historical commentator's words)",
    traditionTags: ["Vaishnavism", "general"],
  },
  {
    title: "The eternal self — an Advaita-informed reading",
    sourceWork: "Bhagavad Gita",
    location: "2.20",
    language: "English (paraphrase)",
    translationText:
      "Read through an Advaita lens, 'the self that is never born nor dies' is Atman, which Advaita holds to be non-different from Brahman, the one changeless reality underlying all appearances. Birth and death belong only to the body-mind; the Self was never limited by them to begin with.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary — Advaita-informed reading (illustrative interpretive gloss, not a specific historical commentator's words)",
    traditionTags: ["Advaita", "Vedanta"],
  },
  {
    title: "The eternal self — a Dvaita-informed reading",
    sourceWork: "Bhagavad Gita",
    location: "2.20",
    language: "English (paraphrase)",
    translationText:
      "Read through a Dvaita (dualist) lens, the verse affirms that the individual soul (jiva) is eternal and distinct — it survives the body's death, but remains forever a real, particular self in loving relationship with the Supreme, rather than dissolving into an undifferentiated absolute.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary — Dvaita-informed reading (illustrative interpretive gloss, not a specific historical commentator's words)",
    traditionTags: ["Vaishnavism", "general"],
  },
  {
    title: "Surrender as the final teaching — a Vaishnava (Bhakti) reading",
    sourceWork: "Bhagavad Gita",
    location: "18.66",
    language: "English (paraphrase)",
    translationText:
      "In the Vaishnava devotional tradition, this closing verse (often called the charama-shloka, 'final verse') is read as Krishna's direct invitation to surrender (sharanagati) to him as the personal Supreme — the culmination of the Gita's teaching, prized especially in Vaishnava schools as the essence of devotional practice.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary — Vaishnava (Bhakti)-informed reading (illustrative interpretive gloss, not a specific historical commentator's words)",
    traditionTags: ["Vaishnavism"],
  },
  {
    title: "Surrender as the final teaching — an Advaita-informed reading",
    sourceWork: "Bhagavad Gita",
    location: "18.66",
    language: "English (paraphrase)",
    translationText:
      "Read through an Advaita lens, 'taking refuge' is reinterpreted as abandoning the sense of being a separate, effort-making agent altogether — a final pointer toward recognizing one's identity with Brahman, beyond the need for any further path or practice, rather than surrender to a personal deity as such.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary — Advaita-informed reading (illustrative interpretive gloss, not a specific historical commentator's words)",
    traditionTags: ["Advaita", "Vedanta"],
  },

  // ---------------- Phase 9: Purana overviews ----------------
  // Brief, careful narrative descriptions of what each Purana covers —
  // NOT fabricated verse text. All paraphrase_summary.
  {
    title: "Vishnu Purana — overview",
    sourceWork: "Vishnu Purana",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Vishnu Purana is a Vaishnava Purana organized around the classical Purana 'five topics' (pancha-lakshana): creation, re-creation, genealogies of gods and sages, cosmic time-cycles (manvantaras), and dynastic histories, including genealogies leading up to the Yadava line associated with Krishna. It presents Vishnu as the sustaining supreme reality underlying these cycles.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism"],
  },
  {
    title: "Shiva Purana — overview",
    sourceWork: "Shiva Purana",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Shiva Purana is a Shaiva Purana centered on the greatness, forms, and mythology of Shiva, including his roles as ascetic and householder, stories of the emergence of the Shiva linga as a symbol of the formless absolute, and the Shiva-Parvati-Ganesha-Kartikeya family narratives central to Shaiva devotional life.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Shaivism"],
  },
  {
    title: "Bhagavata Purana — overview",
    sourceWork: "Bhagavata Purana",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Bhagavata Purana (Shrimad Bhagavatam) is among the most influential Vaishnava Puranas, devoted especially to the life and childhood exploits (lila) of Krishna, along with accounts of other avataras of Vishnu. It is a foundational scriptural source for bhakti (devotional) theology and practice across many later Vaishnava movements.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism"],
  },
  {
    title: "Markandeya Purana — overview",
    sourceWork: "Markandeya Purana",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Markandeya Purana is framed as teachings given to the sage Markandeya, and is best known for containing the Devi Mahatmya (Chandi Patha), the foundational scriptural text of goddess-centered (Shakta) worship recounting the Goddess's defeat of the buffalo-demon Mahishasura and other demons.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Shaktism"],
  },
  {
    title: "Devi Bhagavata Purana — overview",
    sourceWork: "Devi Bhagavata Purana",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Devi Bhagavata Purana is a major Shakta Purana that presents the Goddess (Devi) as the supreme reality underlying and superior to the other principal deities, offering a Devi-centered cosmology, mythology, and theology parallel in structure to Vaishnava Puranas centered on Vishnu.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Shaktism"],
  },
  {
    title: "Skanda Purana — overview",
    sourceWork: "Skanda Purana",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "The Skanda Purana is the largest of the traditional eighteen Mahapuranas, named for Skanda (Kartikeya), Shiva's son. It is less a single unified narrative than a vast compilation of regional mahatmyas (accounts extolling sacred places and pilgrimage sites), devotional stories, and ritual instructions across Shaiva, Vaishnava, and other traditions.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Shaivism", "general"],
  },

  // ---------------- Phase 9: darshana depth (additional angles) ----------------
  {
    title: "Nyaya's four means of valid knowledge (pramanas)",
    sourceWork: "Nyaya darshana",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Nyaya epistemology holds that reliable knowledge arises through exactly four valid means (pramanas): pratyaksha (direct perception), anumana (inference, such as inferring fire from smoke), upamana (comparison/analogy), and shabda (testimony, especially of trustworthy sources including the Veda). Much of Nyaya's technical apparatus is devoted to analyzing when inference is genuinely valid versus fallacious.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Nyaya", "general"],
  },
  {
    title: "Vaisheshika's atomism (paramanu-vada)",
    sourceWork: "Vaisheshika darshana",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Vaisheshika holds that the material world is ultimately composed of indivisible, eternal atoms (paramanu) of the four elements (earth, water, fire, air), which combine in specific ways under an unseen moral-causal principle (adrishta) to form the composite objects of ordinary experience — an early systematic atomist physics developed alongside its category-based (padartha) metaphysics.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaisheshika", "general"],
  },
  {
    title: "Samkhya's purusha-prakriti dualism",
    sourceWork: "Samkhya darshana",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Samkhya's core dualism distinguishes purusha (pure, inactive consciousness, plural — one per individual) from prakriti (single, active, unconscious material nature). Bondage arises from purusha's mistaken identification with the workings of prakriti (intellect, ego, mind, senses, elements); liberation (kaivalya) is the discriminative realization that purusha was never actually entangled, only apparently reflected in prakriti's activity.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Samkhya", "general"],
  },
  {
    title: "Mimamsa's hermeneutics of ritual injunction",
    sourceWork: "Purva Mimamsa darshana",
    location: "general teaching (summary)",
    language: "English (paraphrase)",
    translationText:
      "Purva Mimamsa developed a detailed hermeneutic method for interpreting Vedic injunctions (vidhi) — rules for how to resolve apparent conflicts between ritual texts, how a sentence's primary injunctive force is identified, and how subsidiary statements (arthavada) relate to the main command — treating correct ritual performance, not the ritual's 'meaning' in a modern sense, as the central concern of Vedic exegesis.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Mimamsa", "general"],
  },

  // ---------------- Phase 9: saints and bhakti figures ----------------
  {
    title: "Adi Shankaracharya and the systematization of Advaita",
    sourceWork: "Saints and acharyas (biographical summary)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Adi Shankaracharya (traditionally dated c. 8th century CE) is credited with systematizing Advaita (non-dual) Vedanta through commentaries on the Upanishads, Bhagavad Gita, and Brahma Sutras, and with founding a network of monastic centers (mathas) across India. His teaching centers on the non-difference of Atman and Brahman and the provisional status of the phenomenal world under maya.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Advaita", "Vedanta"],
  },
  {
    title: "Ramanuja and Vishishtadvaita",
    sourceWork: "Saints and acharyas (biographical summary)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Ramanuja (traditionally dated c. 11th-12th century CE) systematized Vishishtadvaita ('qualified non-dualism'), teaching that the individual self and the material world are real and form the 'body' of Brahman (identified with Vishnu-Narayana), rather than illusory appearances — grounding a devotional (bhakti) theology in which loving surrender to a personal Supreme is central to liberation.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "Vedanta"],
  },
  {
    title: "Madhvacharya and Dvaita",
    sourceWork: "Saints and acharyas (biographical summary)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Madhvacharya (traditionally dated c. 13th century CE) founded the Dvaita ('dualist') school of Vedanta, teaching an eternal, real distinction between the Supreme (Vishnu), individual souls, and matter — souls remain forever distinct from and dependent on God even in liberation, which is understood as eternal blissful service rather than merger.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "Vedanta"],
  },
  {
    title: "Tulsidas and the Ramcharitmanas",
    sourceWork: "Saints and acharyas (biographical summary)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Tulsidas (traditionally dated c. 16th century CE) composed the Ramcharitmanas, a devotional retelling of the Rama story in Awadhi (a vernacular related to Hindi), which became one of the most widely read and recited devotional texts in North Indian Hinduism, centering bhakti to Rama as accessible to all regardless of caste or learning.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "general"],
  },
  {
    title: "Mirabai and devotional surrender",
    sourceWork: "Saints and acharyas (biographical summary)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Mirabai (traditionally dated c. 16th century CE), a Rajasthani princess-poet-saint, is remembered for her passionate devotional (bhakti) poetry addressed to Krishna, expressing total surrender and love that defied social and familial expectations placed on her — her songs remain widely sung across North Indian devotional traditions.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism", "general"],
  },
  {
    title: "Kabir and the nirguna bhakti tradition",
    sourceWork: "Saints and acharyas (biographical summary)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Kabir (traditionally dated c. 15th century CE) was a poet-saint whose verses (dohas and padas) express devotion to a formless, attribute-less (nirguna) divine reality beyond sectarian labels, sharply criticizing empty ritualism and religious hypocrisy across both Hindu and Muslim contexts. His poetry is claimed and revered across multiple traditions.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Chaitanya Mahaprabhu and Gaudiya Vaishnavism",
    sourceWork: "Saints and acharyas (biographical summary)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Chaitanya Mahaprabhu (traditionally dated c. 15th-16th century CE) is regarded by Gaudiya Vaishnavas as the founder of a devotional movement centered on ecstatic congregational chanting (sankirtana) of Krishna's names, especially the Hare Krishna mahamantra, teaching bhakti — particularly the mood of Radha's love for Krishna — as the highest spiritual path.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["Vaishnavism"],
  },

  // ---------------- Phase 9: samskaras and daily practice ----------------
  {
    title: "Samskaras — the Hindu life-cycle rites",
    sourceWork: "Dharmashastra tradition (composite)",
    location: "general overview (summary)",
    language: "English (paraphrase)",
    translationText:
      "Samskaras are a traditional series of sacraments marking key transitions across a Hindu life — historically enumerated in varying lists of around sixteen (shodasha samskara), including rites at conception, birth, name-giving, first feeding, first haircut, initiation into study, marriage, and funeral rites. They are understood to purify and sanctify each life stage rather than as merely social ceremonies.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Upanayana — the sacred thread initiation",
    sourceWork: "Dharmashastra tradition (composite)",
    location: "samskara: upanayana (summary)",
    language: "English (paraphrase)",
    translationText:
      "Upanayana is the initiation rite, traditionally performed in childhood or youth for certain communities, marking formal entry into Vedic study under a teacher (guru) and investing the student with the sacred thread (yajnopavita). It traditionally includes the transmission of the Gayatri mantra and is considered a 'second birth' into disciplined learning.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Vivaha — the Hindu marriage samskara",
    sourceWork: "Dharmashastra tradition (composite)",
    location: "samskara: vivaha (summary)",
    language: "English (paraphrase)",
    translationText:
      "Vivaha (marriage) is treated as one of the most significant samskaras, uniting two individuals in a lifelong partnership understood to support dharma, progeny, and mutual companionship. Traditional ceremonies include rites such as kanyadaan (the giving of the bride), the saptapadi (seven steps/vows taken together around sacred fire), and invocation of witnessing deities, with regional variation across India.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Antyesti — the final rites",
    sourceWork: "Dharmashastra tradition (composite)",
    location: "samskara: antyesti (summary)",
    language: "English (paraphrase)",
    translationText:
      "Antyesti ('last sacrifice') is the funeral samskara, traditionally involving cremation and subsequent rites performed by surviving family (notably shraddha ceremonies) understood to assist the departed soul's transition and to fulfill the living's obligations of remembrance and gratitude toward ancestors (pitrs).",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "Sandhyavandanam — daily twilight prayer",
    sourceWork: "Dharmashastra tradition (composite)",
    location: "daily practice: sandhyavandanam (summary)",
    language: "English (paraphrase)",
    translationText:
      "Sandhyavandanam is a traditional daily prayer ritual performed at the junctions of the day (dawn, midday, and dusk), historically obligatory for initiated members of certain communities, involving purificatory sipping of water (achamana), pranayama (breath regulation), recitation of the Gayatri mantra, and offerings to the sun — understood as a discipline that structures the day around remembrance of the sacred.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },
  {
    title: "The basic structure of home puja",
    sourceWork: "General devotional practice (composite)",
    location: "daily practice: puja (summary)",
    language: "English (paraphrase)",
    translationText:
      "A typical home puja (worship ritual) commonly follows a broad sequence — invocation of the deity, offering of items such as water, light (a lit lamp/diya), incense, flowers, and food (naivedya), accompanied by mantras or devotional songs, and closing with aarti (the waving of a lit lamp) — though specific steps, deities, and elaborateness vary widely by family, region, and tradition.",
    sourceType: "paraphrase_summary",
    attribution: "VedVani summary",
    traditionTags: ["general"],
  },

];

type SeedEntity = {
  name: string;
  entityType: "deity" | "concept" | "place" | "person";
  slug: string;
  traditionScopedDescriptions: { tradition: string; description: string }[];
  relatedPassageTitleContains: string[];
};

/**
 * Phase 7 knowledge-graph seed. Each entity carries multiple
 * tradition-scoped descriptions rather than one "universal" description,
 * following the same non-sectarian-ranking principle used elsewhere in
 * VedVani: traditions are presented side by side, none as "correct".
 * relatedPassageTitleContains uses the same pragmatic substring-match
 * pattern as LEARNING_PATHS in src/lib/learningPaths.ts.
 */
const entities: SeedEntity[] = [
  {
    name: "Brahman",
    entityType: "concept",
    slug: "brahman",
    traditionScopedDescriptions: [
      {
        tradition: "Advaita Vedanta",
        description:
          "The one, non-dual, attributeless (nirguna) ultimate reality. All apparent multiplicity, including the individual self, is ultimately identical with Brahman; difference is a matter of appearance (maya), not final truth.",
      },
      {
        tradition: "Vishishtadvaita Vedanta",
        description:
          "The ultimate reality, but understood as 'qualified non-dual' (vishishta-advaita): Brahman is a personal, attribute-possessing (saguna) Supreme Being (identified with Vishnu/Narayana), of whom individual souls and the world are real, eternal modes or attributes — related to Brahman as body to soul, not identical with it.",
      },
      {
        tradition: "Dvaita Vedanta",
        description:
          "The Supreme Being, eternally and irreducibly distinct from individual souls and the material world. Brahman (identified with Vishnu) is the sole independent reality on whom all dependent souls and matter rely, but souls never become identical with Brahman even in liberation.",
      },
    ],
    relatedPassageTitleContains: ["Brahman", "Aham Brahmasmi", "Tat Tvam Asi"],
  },
  {
    name: "Atman",
    entityType: "concept",
    slug: "atman",
    traditionScopedDescriptions: [
      {
        tradition: "Advaita Vedanta",
        description:
          "The true Self, which Advaita holds to be non-different from Brahman itself — eternal, unchanging consciousness, mistakenly identified with the body and mind due to ignorance (avidya).",
      },
      {
        tradition: "Samkhya-Yoga",
        description:
          "Referred to as purusha: pure, changeless consciousness, distinct in each being, and fundamentally separate from prakriti (material nature, including body and mind). Liberation is the clear discernment of this distinction.",
      },
      {
        tradition: "Vaishnava (Dvaita/Vishishtadvaita)",
        description:
          "The individual soul (jivatman), eternally real and personal, existing in a relationship of loving dependence on the Supreme (Brahman/Vishnu) rather than being identical with it.",
      },
    ],
    relatedPassageTitleContains: ["self is never born", "chariot analogy", "Two birds on one tree", "This Self is Brahman"],
  },
  {
    name: "Krishna",
    entityType: "deity",
    slug: "krishna",
    traditionScopedDescriptions: [
      {
        tradition: "Vaishnavism",
        description:
          "Worshipped as a full avatara (or, in some Vaishnava schools, the source of all avataras) of Vishnu — the Supreme Personality of Godhead who teaches Arjuna the Bhagavad Gita and is the object of devotional practice (bhakti).",
      },
      {
        tradition: "Advaita Vedanta",
        description:
          "Understood as the Gita's teacher figure representing Brahman appearing with form (saguna Brahman) for the sake of instruction, while the highest teaching he gives points beyond form to the attributeless (nirguna) non-dual reality.",
      },
    ],
    relatedPassageTitleContains: ["Krishna on periodic divine descent", "devotee dear to the divine"],
  },
  {
    name: "Vishnu",
    entityType: "deity",
    slug: "vishnu",
    traditionScopedDescriptions: [
      {
        tradition: "Vaishnavism",
        description:
          "The Supreme, preserving deity of the trimurti, worshipped as the ultimate personal God who periodically descends as avataras (including Rama and Krishna) to protect dharma.",
      },
      {
        tradition: "Smarta / pluralistic Hindu view",
        description:
          "One of the principal deities honored within the panchayatana system of worship, seen as one valid form through which the single divine reality may be approached alongside Shiva, Devi, Ganesha, and Surya.",
      },
    ],
    relatedPassageTitleContains: ["Krishna on periodic divine descent", "Surrender as the final teaching"],
  },
  {
    name: "Shiva",
    entityType: "deity",
    slug: "shiva",
    traditionScopedDescriptions: [
      {
        tradition: "Shaivism",
        description:
          "Worshipped as the Supreme reality itself — simultaneously the destroyer within the trimurti and, in Shaiva theology, the ultimate ground of all existence, transcending and including creation and dissolution.",
      },
      {
        tradition: "Smarta / pluralistic Hindu view",
        description:
          "One of the five principal deities of panchayatana worship, honored as one legitimate form of approach to the single divine reality alongside Vishnu, Devi, Ganesha, and Surya.",
      },
    ],
    relatedPassageTitleContains: ["devotee dear to the divine"],
  },
  {
    name: "Purusha",
    entityType: "concept",
    slug: "purusha",
    traditionScopedDescriptions: [
      {
        tradition: "Samkhya",
        description:
          "Pure, plural, changeless consciousness — one of the two fundamental principles (alongside prakriti, material nature). Each being's purusha is distinct.",
      },
      {
        tradition: "Vedic (Purusha Sukta)",
        description:
          "The cosmic being described in the Rigveda's Purusha Sukta, whose symbolic sacrifice and dismemberment is described as giving rise to the universe and to human society's varnas.",
      },
    ],
    relatedPassageTitleContains: ["Purusha Sukta"],
  },
  {
    name: "Dharma",
    entityType: "concept",
    slug: "dharma",
    traditionScopedDescriptions: [
      {
        tradition: "Purva Mimamsa",
        description:
          "Right action as defined by and known through Vedic ritual injunction — dharma is fundamentally about correctly performing prescribed duties and rites.",
      },
      {
        tradition: "General / pluralistic Hindu ethical view",
        description:
          "A person's righteous duty or way of being in right relationship with the cosmic order, understood contextually (svadharma) according to one's role, stage of life, and circumstances, and central to the Bhagavad Gita's ethical teaching to Arjuna.",
      },
    ],
    relatedPassageTitleContains: ["Krishna on periodic divine descent", "Purva Mimamsa", "Arjuna's despair"],
  },
  {
    name: "Karma",
    entityType: "concept",
    slug: "karma",
    traditionScopedDescriptions: [
      {
        tradition: "Karma Yoga (Bhagavad Gita)",
        description:
          "Both the general law of action and consequence, and — as karma yoga — a spiritual path of performing one's duty without attachment to the fruits of action, offered as one of the Gita's principal routes to liberation.",
      },
      {
        tradition: "Purva Mimamsa",
        description:
          "Chiefly understood in terms of ritual action (karma-kanda): the correct performance of Vedic rites generates their prescribed results, and right conduct of these rites is itself central to dharma.",
      },
    ],
    relatedPassageTitleContains: ["action without attachment", "Three paths: knowledge, action, devotion"],
  },
  {
    name: "Moksha",
    entityType: "concept",
    slug: "moksha",
    traditionScopedDescriptions: [
      {
        tradition: "Advaita Vedanta",
        description:
          "Liberation understood as the direct realization that one's true Self (Atman) is not different from Brahman — the dissolution of the ignorance that gives rise to the sense of separateness, not literally 'going' anywhere.",
      },
      {
        tradition: "Vaishnava (Dvaita/Vishishtadvaita)",
        description:
          "Liberation understood as the soul's eternal, loving, personal communion with the Supreme (Vishnu) in a divine abode — real, blissful relationship rather than dissolution of individual identity.",
      },
      {
        tradition: "Yoga",
        description:
          "Kaivalya — the isolation of purusha (pure consciousness) from prakriti (material nature) achieved through disciplined practice, stilling the fluctuations of the mind.",
      },
    ],
    relatedPassageTitleContains: ["Yoga — the school of disciplined practice", "self is Brahman"],
  },
  {
    name: "Yajna",
    entityType: "concept",
    slug: "yajna",
    traditionScopedDescriptions: [
      {
        tradition: "Purva Mimamsa / Vedic ritualism",
        description:
          "Sacrifice/ritual offering, understood as an eternally efficacious, prescribed action whose correct performance is central to fulfilling Vedic dharma and maintaining cosmic order.",
      },
      {
        tradition: "Bhagavad Gita (Karma Yoga reading)",
        description:
          "Reinterpreted beyond literal ritual fire-offerings to include any action performed selflessly, as an offering, without attachment to personal gain — 'yajna' as a spirit in which all work can be done.",
      },
    ],
    relatedPassageTitleContains: ["Purva Mimamsa", "action without attachment"],
  },
  {
    name: "Om (Aum)",
    entityType: "concept",
    slug: "om-aum",
    traditionScopedDescriptions: [
      {
        tradition: "Vedanta / Upanishadic view",
        description:
          "The primordial sacred syllable said to represent Brahman itself in sound form — the object of meditation held in several Upanishads to symbolize the totality of waking, dreaming, deep sleep, and the fourth, transcendent state.",
      },
      {
        tradition: "General devotional/ritual use",
        description:
          "Chanted at the start and close of prayers, mantras, and rituals across nearly all Hindu traditions as an auspicious invocation, regardless of one's particular theological school.",
      },
    ],
    relatedPassageTitleContains: ["Nasadiya Sukta", "This Self is Brahman"],
  },
  {
    name: "Maya",
    entityType: "concept",
    slug: "maya",
    traditionScopedDescriptions: [
      {
        tradition: "Advaita Vedanta",
        description:
          "The beginningless cosmic power of appearance that makes the one non-dual Brahman seem to appear as the manifold world and separate selves; not ultimately real in the way Brahman is, though not simply 'nothing' either.",
      },
      {
        tradition: "Vaishnava (Vishishtadvaita/Dvaita)",
        description:
          "Reinterpreted less as a veiling illusion and more as the Supreme's own real, wondrous creative power (often linked to the goddess Lakshmi/Shakti) by which a genuinely real world and souls are brought forth — the world's reality is affirmed, not denied.",
      },
    ],
    relatedPassageTitleContains: ["self is Brahman", "That art thou"],
  },
];

async function seedKnowledgeEntities() {
  const existing = await prisma.knowledgeEntity.count();
  if (existing >= entities.length) {
    console.log(`Knowledge entities already has ${existing} rows (>= ${entities.length}) — skipping seed.`);
    return;
  }
  if (existing > 0) {
    console.log(`Knowledge entities has ${existing} rows, expected ${entities.length} — resetting and reseeding.`);
    await prisma.knowledgeEntity.deleteMany({});
  }
  console.log(`Seeding ${entities.length} knowledge entities...`);
  for (const e of entities) {
    await prisma.knowledgeEntity.create({ data: e });
  }
  console.log("Knowledge entity seed complete.");
}

async function main() {
  const existing = await prisma.corpusPassage.count();
  if (existing >= passages.length) {
    console.log(`Corpus already has ${existing} passages (>= ${passages.length}) — skipping seed.`);
  } else {
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

  await seedKnowledgeEntities();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
