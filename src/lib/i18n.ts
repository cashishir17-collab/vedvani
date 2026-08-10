/**
 * Phase 6: minimal locale system for VedVani's chrome (nav, headers,
 * buttons). This intentionally does NOT translate full page body content
 * (corpus text, chat answers, learning path descriptions, etc.) — that is
 * future work. It only covers the strings needed to make the locale
 * toggle visibly work across nav/headers/buttons on every top-level page.
 */

export type Locale = "en" | "hi";

export const LOCALE_COOKIE_NAME = "vv_locale";

type Dict = Record<string, string>;

const en: Dict = {
  brand: "VedVani",
  navAsk: "Ask",
  navHistory: "History",
  navMemory: "Memory",
  navRead: "Read",
  navLearn: "Learn",
  navEntities: "Entities",
  navBookmarks: "Bookmarks",
  navAdmin: "Admin",
  navAccount: "Account",
  guest: "Guest",
  logIn: "Log in",
  logOut: "Log out",
  footer:
    "VedVani offers pluralistic, cited information about Hindu scripture and tradition. It does not claim divine authority and can make mistakes — always verify important matters with a qualified teacher or primary source.",
  askVedVani: "Ask VedVani",
  asking: "Asking...",
  mic: "Mic",
  stopMic: "Stop mic",
  send: "Send",
  sending: "Sending...",
  homeTitle: "VedVani",
  homeIntro:
    "Ask about the Vedas, Upanishads, Bhagavad Gita, or Puranas. Answers are grounded in a cited, public-domain corpus and clearly label synthesis vs. scripture vs. tradition. VedVani never claims divine authority and stays neutral across sampradayas.",
  readTitle: "Read the Scripture Library",
  readIntro: "Browse all passages, grouped by source work.",
  learnTitle: "Learning Paths",
  learnIntro: "Guided sequences of passages to build understanding step by step.",
  bookmarksTitle: "Bookmarks",
  historyTitle: "History",
  memoryTitle: "Memory",
  adminTitle: "Admin — Editorial Console",
  entitiesTitle: "Entities & Concepts",
  entitiesIntro: "Deities, concepts, places, and figures, with tradition-scoped descriptions.",
  responseMode: "Response style",
  modeConcise: "Concise",
  modeDetailed: "Detailed",
  modeChildFriendly: "Child-friendly",
  modeAcademic: "Academic",
  modeDevotional: "Devotional",
  compareInterpretations: "Compare interpretations",
  relatedEntities: "Related",
};

const hi: Dict = {
  brand: "वेदवाणी",
  navAsk: "पूछें",
  navHistory: "इतिहास",
  navMemory: "स्मृति",
  navRead: "पढ़ें",
  navLearn: "सीखें",
  navEntities: "विषय-सूची",
  navBookmarks: "बुकमार्क",
  navAdmin: "व्यवस्थापक",
  navAccount: "खाता",
  guest: "अतिथि",
  logIn: "लॉग इन करें",
  logOut: "लॉग आउट करें",
  footer:
    "वेदवाणी हिंदू शास्त्र और परंपरा के बारे में बहुलवादी, उद्धृत जानकारी प्रदान करता है। यह दैवीय अधिकार का दावा नहीं करता और गलतियाँ कर सकता है — महत्वपूर्ण विषयों के लिए हमेशा किसी योग्य गुरु या मूल स्रोत से पुष्टि करें।",
  askVedVani: "वेदवाणी से पूछें",
  asking: "पूछा जा रहा है...",
  mic: "माइक",
  stopMic: "माइक बंद करें",
  send: "भेजें",
  sending: "भेजा जा रहा है...",
  homeTitle: "वेदवाणी",
  homeIntro:
    "वेदों, उपनिषदों, भगवद गीता, या पुराणों के बारे में पूछें। उत्तर एक उद्धृत, सार्वजनिक-डोमेन संग्रह पर आधारित हैं और संश्लेषण बनाम शास्त्र बनाम परंपरा को स्पष्ट रूप से चिह्नित करते हैं। वेदवाणी कभी भी दैवीय अधिकार का दावा नहीं करता और सभी संप्रदायों के प्रति तटस्थ रहता है।",
  readTitle: "शास्त्र पुस्तकालय पढ़ें",
  readIntro: "स्रोत ग्रंथ के अनुसार समूहीकृत सभी अंश ब्राउज़ करें।",
  learnTitle: "शिक्षण पथ",
  learnIntro: "समझ बनाने के लिए अंशों के निर्देशित क्रम।",
  bookmarksTitle: "बुकमार्क",
  historyTitle: "इतिहास",
  memoryTitle: "स्मृति",
  adminTitle: "व्यवस्थापक — संपादकीय कक्ष",
  entitiesTitle: "विषय एवं अवधारणाएँ",
  entitiesIntro: "देवता, अवधारणाएँ, स्थान, और व्यक्तित्व, परंपरा-विशिष्ट विवरणों के साथ।",
  responseMode: "उत्तर शैली",
  modeConcise: "संक्षिप्त",
  modeDetailed: "विस्तृत",
  modeChildFriendly: "बाल-अनुकूल",
  modeAcademic: "शैक्षणिक",
  modeDevotional: "भक्तिपूर्ण",
  compareInterpretations: "व्याख्याओं की तुलना करें",
  relatedEntities: "संबंधित",
};

const DICTS: Record<Locale, Dict> = { en, hi };

export function t(locale: Locale, key: keyof typeof en): string {
  return DICTS[locale]?.[key] ?? en[key] ?? key;
}

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "hi";
}
