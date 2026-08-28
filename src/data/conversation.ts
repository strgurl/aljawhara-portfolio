import { L } from "@/lib/i18n";
import type { ConversationNode, ContactAction, FollowUp } from "@/types/conversation";
import { projectsById, workProjects } from "@/data/projects";
import { allExperiences } from "@/data/journey";
import { CONTACT, mailtoHref } from "@/data/contact";

/**
 * The conversation graph. Every answer here is authored — nothing is generated,
 * so browsing costs nothing and can never be rate limited.
 *
 * Arabic is the source of truth for intent and tone; English is written to
 * carry the same meaning naturally rather than translated from it.
 *
 * Follow-up questions are kept deliberately few. The cards and detail sheets
 * carry the detail, and a question only survives where it adds something the
 * sheet does not already say. Journey is a timeline, Skills shows the clusters,
 * and Contact surfaces its actions directly rather than behind questions.
 */

/**
 * The three ways to reach her, always in this order. A value that isn't set
 * yet renders as an inert row rather than disappearing, so the shape of the
 * section is stable and filling in a value is the only change needed.
 */
const contactActions: ContactAction[] = [
  { channel: "email", label: L("Email", "الإيميل"), value: mailtoHref },
  { channel: "linkedin", label: L("LinkedIn", "LinkedIn"), value: CONTACT.linkedin },
  { channel: "cv", label: L("CV", "السيرة الذاتية"), value: CONTACT.cv },
];

const to = (label: FollowUp["label"], targetId: string): FollowUp => ({ label, targetId });

/** The one shared bridge left in the graph. */
const askWork = L("What have you worked on?", "وش مشاريعك؟");

/** Navigation labels for the four Work cards. */
const projectChip = {
  umbra: L("Tell me about UMBRA", "كلميني عن UMBRA"),
  vrlingo: L("Tell me about VRLingo", "كلميني عن VRLingo"),
  taazur: L("Tell me about Taazur", "كلميني عن تآزر"),
  portfolio: L("Tell me about this portfolio", "كلميني عن هذا الموقع"),
  fanAlKabsa: L("Tell me about Fan Al Kabsa", "كلميني عن فن الكبسة"),
};

const umbraQuestions = {
  gemini: L("How did you use Gemini?", "كيف استخدمتوا Gemini؟"),
  shade: L("How did you calculate the shade?", "كيف حسبتوا الظل؟"),
};

const vrlingoQuestions = {
  whyVr: L("Why VR for learning a language?", "ليش اخترتوا VR لتعلّم اللغة؟"),
  characters: L("How do the conversational characters work?", "كيف تشتغل الشخصيات الحوارية؟"),
};

const portfolioQuestions = {
  authored: L("Why write every answer in advance?", "طيب ليش الإجابات مو مولّدة؟"),
  matching: L("How does the matching work?", "كيف تتم المطابقة؟"),
};

export const conversationNodes: Record<string, ConversationNode> = {
  // ---------------------------------------------------------------- Me
  me: {
    id: "me",
    triggers: {
      en: [
        "who are you",
        "about you",
        "tell me about yourself",
        "introduce yourself",
        "who is aljawhara",
        "about aljawhara",
      ],
      ar: ["من انت", "مين انتي", "عنك", "عرفيني بنفسك", "من هي الجوهرة", "عن الجوهرة"],
    },
    paragraphs: {
      en: [
        "Hi, I'm Aljawhara. Glad you're here 👋",
        "I study AI, and I'd rather build and try things than stop at the theory side of it.",
        "AI is the field I love and keep coming back to, but my curiosity doesn't stop at one field. When an idea catches me, I like to follow it and learn whatever it needs until it turns from an idea into something I can build and try.",
        "It's easier for me to widen what I know than to shrink an idea so it fits.",
      ],
      ar: [
        "السلام عليكم، أنا الجوهرة 👋 سعيدة إنك هنا.",
        "طالبة ذكاء اصطناعي، وأحب أبني وأجرب أكثر من إني أوقف عند الجانب النظري.",
        "الذكاء الاصطناعي هو المجال اللي أحبّه وأرجع له دائمًا، لكن فضولي ما يوقف عند مجال واحد. إذا شدتني فكرة، أحب أتبعها وأتعلم اللي تحتاجه لين تتحول من مجرد فكرة لشيء أقدر أبنيه وأجربه.",
        "بالنسبة لي، أسهل إني أوسّع اللي أعرفه من إني أصغّر الفكرة عشان تناسبه.",
      ],
    },
    followUps: [to(askWork, "work")],
  },

  // -------------------------------------------------------------- Work
  work: {
    id: "work",
    triggers: {
      en: [
        "work",
        "projects",
        "portfolio",
        "what have you built",
        "show me your work",
        "what have you worked on",
      ],
      ar: ["اعمالك", "مشاريع", "مشاريعك", "وش بنيتي", "وريني شغلك"],
    },
    paragraphs: {
      en: [
        "A few of the projects I've built. Open any card for the idea behind it, how it works, and what it was built with.",
      ],
      ar: [
        "هذي مجموعة من مشاريعي. اضغط على أي مشروع وبتلقى فكرته، تفاصيله، والتقنيات اللي استخدمناها.",
      ],
    },
    projects: workProjects,
    followUps: [
      to(projectChip.umbra, "project-umbra"),
      to(projectChip.vrlingo, "project-vrlingo"),
      to(projectChip.taazur, "project-taazur"),
      to(projectChip.portfolio, "project-portfolio"),
      to(projectChip.fanAlKabsa, "project-fan-al-kabsa"),
    ],
  },

  // --------------------------------------------------------------- UMBRA
  "project-umbra": {
    id: "project-umbra",
    triggers: {
      en: ["umbra", "shade route", "shade routing", "riyadh walking"],
      ar: ["امبرا", "المشي في الرياض", "طريق الظل"],
    },
    paragraphs: projectsById.umbra.body,
    projects: [projectsById.umbra],
    followUps: [
      to(umbraQuestions.gemini, "umbra-gemini"),
      to(umbraQuestions.shade, "umbra-shade"),
    ],
  },

  "umbra-gemini": {
    id: "umbra-gemini",
    triggers: {
      en: ["how did you use gemini", "gemini", "does the ai pick the route"],
      ar: ["كيف استخدمتوا جيميني", "دور جيميني", "الذكاء الاصطناعي يختار الطريق"],
    },
    paragraphs: {
      en: [
        "After the route data has been calculated. It takes the finished numbers and explains the difference between the options in plain language, with explicit instructions not to change any value or choose the route itself.",
      ],
      ar: [
        "استخدمناه بعد ما تنحسب بيانات المسار. يأخذ الأرقام الجاهزة ويشرح الفرق بين الخيارات بلغة بسيطة، مع تعليمات واضحة إنه ما يغير أي قيمة ولا يختار المسار بنفسه.",
      ],
    },
    followUps: [to(umbraQuestions.shade, "umbra-shade")],
  },

  "umbra-shade": {
    id: "umbra-shade",
    triggers: {
      en: ["how did you calculate the shade", "shade data", "where does shade come from"],
      ar: ["كيف حسبتوا الظل", "بيانات الظل", "وين الظل"],
    },
    paragraphs: {
      en: [
        "The sun's position itself is calculated from the date and time, but the shade percentage in the MVP is based on prototype data. The next step for the project is connecting those calculations to real data on buildings, tree cover and street orientation.",
      ],
      ar: [
        "موقع الشمس نفسه محسوب من التاريخ والوقت، لكن نسبة الظل في الـMVP مبنية على بيانات تجريبية. الخطوة التالية للمشروع هي ربط الحسابات ببيانات حقيقية للمباني والأشجار واتجاهات الشوارع.",
      ],
    },
    followUps: [to(umbraQuestions.gemini, "umbra-gemini")],
  },

  // ------------------------------------------------------------- VRLingo
  "project-vrlingo": {
    id: "project-vrlingo",
    triggers: {
      en: ["vrlingo", "vr language", "language game", "sidequest"],
      ar: ["في ار لينقو", "لعبة تعلم اللغة", "الواقع الافتراضي"],
    },
    paragraphs: projectsById.vrlingo.body,
    projects: [projectsById.vrlingo],
    followUps: [
      to(vrlingoQuestions.whyVr, "vrlingo-why-vr"),
      to(vrlingoQuestions.characters, "vrlingo-characters"),
    ],
  },

  "vrlingo-characters": {
    id: "vrlingo-characters",
    triggers: {
      en: ["how do the characters work", "convai", "npc", "how do they respond"],
      ar: ["كيف تشتغل الشخصيات", "الشخصيات الحوارية", "كونفاي"],
    },
    paragraphs: {
      en: [
        "The characters run on Convai, a ready-made conversational platform for game characters, so we weren't building a dialogue model ourselves. What we did was give each character a role and a context that fits the place, and set them up to help and correct you when you get something wrong rather than letting the conversation stall.",
      ],
      ar: [
        "الشخصيات تشتغل على Convai، وهي منصة حوارية جاهزة لشخصيات الألعاب، فما بنينا نموذج حوار من الصفر. اللي سويناه إننا نعطي كل شخصية دور وسياق يناسب المكان، ونجهزها إنها تساعدك وتصحح لك إذا أخطأت في الكلام بدل ما يتوقف الحوار.",
      ],
    },
    followUps: [to(askWork, "work")],
  },

  "vrlingo-why-vr": {
    id: "vrlingo-why-vr",
    triggers: {
      en: ["why vr for learning a language", "why vr", "why not an app"],
      ar: ["ليش الواقع الافتراضي", "ليش vr", "ليش مو تطبيق عادي"],
    },
    // cross-linked to the sibling question below
    paragraphs: {
      en: [
        "Because the goal was to tie the language to a situation, not just a word on a screen. In VR you can hear, speak, pick things up and interact with the place, so a word ends up attached to something you saw or did inside the experience.",
      ],
      ar: [
        "لأن الهدف كان نخلي اللغة مرتبطة بموقف، مو بس كلمة على شاشة. في VR تقدر تسمع، تتكلم، تمسك الأشياء وتتفاعل مع المكان، فالمفردة تصير مرتبطة بشي شفته أو سويته داخل التجربة.",
      ],
    },
    followUps: [to(vrlingoQuestions.characters, "vrlingo-characters")],
  },

  // -------------------------------------------------------------- Taazur
  "project-taazur": {
    id: "project-taazur",
    triggers: {
      en: ["taazur", "teammate matching", "team formation"],
      ar: ["تازر", "تكوين الفرق", "مطابقة الفرق"],
    },
    paragraphs: projectsById.taazur.body,
    projects: [projectsById.taazur],
    followUps: [
      to(L("How does it decide who to suggest?", "كيف يقرر مين يقترح؟"), "taazur-matching"),
    ],
  },

  "taazur-matching": {
    id: "taazur-matching",
    triggers: {
      en: ["how does it decide who to suggest", "how does it suggest teammates"],
      ar: ["كيف يقرر مين يقترح", "كيف يقترح الاعضاء"],
    },
    paragraphs: {
      en: [
        "It looks at coverage in both directions: not only whether you have what I need, but whether I have what you need too. A suggestion that only works one way tends not to hold, so the ranking favours pairs who complete each other both ways.",
      ],
      ar: [
        "يشوف التغطية من الجهتين: مو بس هل عندك اللي أحتاجه، لكن هل عندي اللي تحتاجه بعد. الاقتراح اللي يمشي من جهة وحدة غالبًا ما يستمر، فالترتيب يعطي أولوية للأزواج اللي يكملون بعض في الاتجاهين.",
      ],
    },
    followUps: [to(askWork, "work")],
  },

  // ------------------------------------------------------------ Portfolio
  "project-portfolio": {
    id: "project-portfolio",
    triggers: {
      en: [
        "this portfolio",
        "this website",
        "this site",
        "how was this built",
        "how does this work",
        "why no chatbot",
        "is this a chatbot",
        "is this an llm",
      ],
      ar: [
        "هذا الموقع",
        "الموقع نفسه",
        "كيف بنيتي الموقع",
        "كيف يشتغل الموقع",
        "ليش ما فيه شات بوت",
        "هل هذا شات بوت",
      ],
    },
    paragraphs: projectsById.portfolio.body,
    projects: [projectsById.portfolio],
    followUps: [
      to(portfolioQuestions.authored, "portfolio-authored"),
      to(portfolioQuestions.matching, "portfolio-matching"),
    ],
  },

  "portfolio-authored": {
    id: "portfolio-authored",
    triggers: {
      en: ["why write every answer in advance", "why not generated", "why no llm", "authored"],
      ar: ["ليش الاجابات مو مولدة", "ليش مكتوبة مسبقا", "ليش ما تستخدمين نموذج"],
    },
    paragraphs: {
      en: [
        "Because the portfolio speaks for me, and I don't want any chance of the system adding something that isn't true. Everything you read is written and reviewed in advance, and the reply reaches you instantly with no cost and no usage limits. Free typing still stays; your question is routed to content that already exists rather than generated on the spot.",
      ],
      ar: [
        "لأن البورتفوليو يتكلم عني، وما أبي احتمال إن النظام يضيف معلومة مو صحيحة. كل شيء تقراه مكتوب ومراجع مسبقًا، وبنفس الوقت الرد يوصلك على طول بدون تكلفة ولا حدود استخدام. والكتابة الحرة باقية، بس السؤال يتوجه لمحتوى موجود بدل ما يتولد في اللحظة.",
      ],
    },
    followUps: [to(portfolioQuestions.matching, "portfolio-matching")],
  },

  "portfolio-matching": {
    id: "portfolio-matching",
    triggers: {
      en: ["how does the matching work", "intent matching", "how does it understand what i type"],
      ar: ["كيف تتم المطابقة", "كيف يفهم اللي اكتبه"],
    },
    paragraphs: {
      en: [
        "The matching is local, and works on phrases, keywords and how much of your question is accounted for. Arabic gets its own handling to unify some spelling variations and strip diacritics, so different phrasings of the same question land in the same place as far as possible.",
      ],
      ar: [
        "المطابقة محلية وتعتمد على عبارات وكلمات مفتاحية وتغطية السؤال. العربي له معالجة خاصة لتوحيد بعض اختلافات الكتابة وإزالة التشكيل، عشان الصيغ المختلفة للسؤال توصل لنفس المعنى قدر الإمكان.",
      ],
    },
    followUps: [to(askWork, "work")],
  },

  // --------------------------------------------------------- Fan Al Kabsa
  "project-fan-al-kabsa": {
    id: "project-fan-al-kabsa",
    triggers: {
      en: ["fan al kabsa", "roblox", "restaurant game", "roblox game"],
      ar: ["فن الكبسة", "فن الكبسه", "روبلوكس", "لعبة المطعم"],
    },
    paragraphs: projectsById["fan-al-kabsa"].body,
    projects: [projectsById["fan-al-kabsa"]],
    followUps: [to(askWork, "work")],
  },

  // ------------------------------------------------------------- Journey
  journey: {
    id: "journey",
    triggers: {
      en: [
        "journey",
        "experience",
        "background",
        "how did you get here",
        "education",
        "university",
        "milestones",
        // Recruiters ask about the degree in these words. The answer — still
        // studying, 2027 expected — is on this node, so route it here rather
        // than letting "project" pull it toward current work.
        "graduation",
        "graduation year",
        "when do you graduate",
        "graduation project",
        "degree",
        "major",
      ],
      ar: [
        "مسيرتك",
        "خبرتك",
        "كيف وصلتي",
        "دراستك",
        "الجامعة",
        "محطاتك",
        "سنة التخرج",
        "متى تتخرجين",
        "تخرجك",
        "مشروع التخرج",
        "تخصصك",
      ],
    },
    paragraphs: {
      en: [
        "The milestones that have shaped what I do so far, from university through bootcamps and hackathons.",
      ],
      ar: [
        "هذي أبرز المحطات اللي كان لها أثر في تجربتي إلى الآن، من الجامعة إلى المعسكرات والهاكاثونات.",
      ],
    },
    experiences: allExperiences,
    followUps: [to(askWork, "work")],
  },

  // -------------------------------------------------------------- Skills
  skills: {
    id: "skills",
    triggers: {
      en: ["skills", "stack", "tech stack", "technologies", "tools", "what do you work with"],
      ar: ["مهاراتك", "ادواتك", "تقنيات", "وش تشتغلين فيه"],
    },
    paragraphs: {
      en: [
        "The technologies and skills I work with, grouped by what I use them for rather than listed as one long line without context.",
      ],
      ar: [
        "هذي أبرز التقنيات والمهارات اللي أشتغل فيها، مرتبة حسب نوع الاستخدام بدل قائمة طويلة بدون سياق.",
      ],
    },
    skillClusters: [
      {
        heading: L("AI", "الذكاء الاصطناعي"),
        tags: [
          "Python",
          "LLM integration",
          "Prompt engineering",
          "Gemini API",
          "RAG",
          "AI agents & MCP workflows",
          "Transformer-based NLP",
          "scikit-learn",
          "Feature engineering",
          "Model evaluation",
        ],
      },
      {
        heading: L("Product development", "تطوير المنتجات"),
        tags: [
          "React",
          "TypeScript",
          "Firebase / Firestore",
          "REST APIs",
          "Flask",
          "Tailwind CSS",
          "Netlify",
        ],
      },
      {
        heading: L("XR, 3D and interactive", "XR و3D والتجارب التفاعلية"),
        tags: [
          "Unity",
          "C#",
          "XR Interaction Toolkit",
          "AR & VR development",
          "Vuforia",
          "Three.js / React Three Fiber",
          "Roblox Studio / Luau",
        ],
      },
      {
        heading: L("Data", "البيانات"),
        tags: ["pandas", "NumPy", "SQL", "Data analysis & preprocessing"],
      },
    ],
    followUps: [to(askWork, "work")],
  },

  // ----------------------------------------------------------------- Now
  now: {
    id: "now",
    triggers: {
      en: ["now", "currently", "these days", "what are you up to", "side project"],
      ar: ["حاليا", "هالفترة", "وش شغلك", "مشروع جانبي"],
    },
    paragraphs: {
      en: [
        "I'm in my final year, so a large part of my focus goes to my graduation project and getting ready for what comes next, while I look for a practical internship I can learn from and apply more in.",
        "On the side, I'm working on a personal AI project where I put RAG, agents and connecting tools and APIs into practice. It doesn't have a name yet, and I'd rather wait until it's further along before showing it.",
      ],
      ar: [
        "حاليًا أنا في سنة التخرج، فجزء كبير من تركيزي رايح لمشروع التخرج والاستعداد للمرحلة الجاية، وبنفس الوقت أبحث عن فرصة تدريب عملي أقدر أتعلم منها وأطبق أكثر.",
        "وعلى الجانب، أشتغل على مشروع شخصي في الذكاء الاصطناعي أطبق فيه RAG والـagents وربط الأدوات والـAPIs بشكل عملي. للحين ما أعطيته اسم، وأفضّل أنتظر لين يكتمل أكثر قبل ما أعرضه.",
      ],
    },
    followUps: [to(askWork, "work")],
  },

  // ------------------------------------------------------------- Contact
  contact: {
    id: "contact",
    triggers: {
      en: [
        "contact",
        "email",
        "reach you",
        "contact you",
        "get in touch",
        "how can i reach you",
        "how do i contact you",
        "hire",
        "linkedin",
        "cv",
        "resume",
      ],
      ar: [
        "تواصل",
        "ايميل",
        "كيف اوصلك",
        "كيف اتواصل معك",
        "شلون اتواصل معك",
        "اتواصل معك",
        "كيف اكلمك",
        "اكلمك",
        "ابي اتواصل",
        "توظيف",
        "لينكدان",
        "السيرة الذاتية",
      ],
    },
    paragraphs: {
      en: [
        "If you'd like to get in touch, these are the easiest ways:",
        "I'm currently interested in internships and co-op opportunities, and open to opportunities and projects I can learn from and add to.",
      ],
      ar: [
        "إذا حاب تتواصل معي، هذي أسهل الطرق:",
        "حاليًا مهتمة بفرص التدريب والتدريب التعاوني، وأرحب بالفرص والمشاريع اللي أقدر أتعلم منها وأضيف لها.",
      ],
    },
    contact: contactActions,
  },

  /**
   * Reached when nothing matches confidently — never a fabricated answer.
   * The send button is built per message from the visitor's own question, so
   * it lives in the renderer rather than here.
   */
  fallback: {
    id: "fallback",
    paragraphs: {
      en: ["I don't have a prepared answer for that, but you can send it to me directly."],
      ar: ["ما عندي إجابة جاهزة لهذا السؤال، لكن تقدر ترسله لي مباشرة."],
    },
    // No "how do I reach you?" hop — the Ask me directly button on this answer
    // opens the email straight away, carrying the question with it.
    followUps: [to(askWork, "work")],
  },
};

export function getNode(id: string): ConversationNode {
  return conversationNodes[id] ?? conversationNodes.fallback;
}
