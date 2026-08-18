import { L } from "@/lib/i18n";
import type { ConversationNode } from "@/types/conversation";
import { allProjects } from "@/data/projects";
import { allExperiences } from "@/data/journey";

const EMAIL = "mailto:hello@jawhara.dev";

/**
 * The conversation graph. Every answer here is authored — nothing is generated,
 * so browsing costs nothing and can never be rate limited.
 *
 * EN and AR are authored separately — same information and personality, each
 * written naturally in its own language rather than translated from the other.
 * Both remain placeholder copy until the real content pass.
 */
export const conversationNodes: Record<string, ConversationNode> = {
  intro: {
    id: "intro",
    paragraphs: {
      en: ["Hey — I'm Jawhara. Ask me anything, or pick a place to start."],
      ar: ["هلا، أنا جوهرة. اسألني عن أي شي، أو ابدأ من وحدة من هذي."],
    },
  },

  me: {
    id: "me",
    triggers: {
      en: ["who are you", "about you", "tell me about yourself", "about jawhara", "who is jawhara"],
      ar: ["من أنت", "عنك", "عرفيني بنفسك", "من هي جوهرة"],
    },
    paragraphs: {
      en: [
        "I'm Jawhara — I design and build software where the interaction is the product, not a wrapper around it. Most of my work sits at the intersection of AI systems and interface craft.",
        "Before this, I spent a few years shipping full-stack product work, which is where the instinct for detail and finish comes from.",
      ],
      ar: [
        "أنا جوهرة. أصمم وأبني برامج يكون التفاعل فيها هو المنتج نفسه، مو مجرد غلاف حوله. أغلب شغلي بين أنظمة الذكاء الاصطناعي وحرفية الواجهات.",
        "قبلها اشتغلت سنوات على منتجات متكاملة، ومن هناك جاني الهوس بالتفاصيل والإتقان.",
      ],
    },
    techTags: ["AI Engineer", "Creative Developer", "Based remotely"],
    followUps: [
      { label: L("Where have you worked and learned?", "وين اشتغلتي وتعلمتي؟"), targetId: "journey" },
      { label: L("Show me your work", "ورّيني شغلك"), targetId: "projects" },
      { label: L("What tools do you use?", "وش الأدوات اللي تستخدمينها؟"), targetId: "skills" },
    ],
  },

  now: {
    id: "now",
    triggers: {
      en: ["now", "currently", "what are you working on", "these days", "fun", "hobbies", "free time"],
      ar: ["الآن", "حالياً", "على ماذا تعملين", "هذه الأيام", "ممتع", "هوايات", "وقت الفراغ"],
    },
    paragraphs: {
      en: [
        "Right now I'm deep in a run of interactive, narrative-driven interfaces — places where motion and structure carry as much meaning as the copy does.",
        "Outside of that: reading on interface theory, and slowly getting better at generative design tooling.",
      ],
      ar: [
        "هالفترة مركّزة على واجهات تفاعلية فيها حكاية — الحركة والترتيب يوصلون المعنى مثل النص بالضبط.",
        "وبعيداً عن الشغل: أقرأ عن تصميم الواجهات، وأطوّر نفسي شوي بشوي في أدوات التصميم التوليدي.",
      ],
    },
    followUps: [
      { label: L("Show me your work", "ورّيني شغلك"), targetId: "projects" },
      { label: L("How do I reach you?", "كيف أوصل لك؟"), targetId: "contact" },
    ],
  },

  projects: {
    id: "projects",
    triggers: {
      en: ["project", "projects", "work", "portfolio", "show me your work", "what have you built"],
      ar: ["مشروع", "مشاريع", "أعمال", "أعمالك", "ماذا بنيت"],
    },
    paragraphs: {
      en: [
        "A few things I've shipped recently — spanning applied AI products and fully custom interactive builds. Tap a card for the full story.",
      ],
      ar: [
        "هذي بعض الأشياء اللي طلعتها مؤخراً، بين منتجات ذكاء اصطناعي وأعمال تفاعلية مبنية من الصفر. اضغط أي بطاقة وأحكي لك القصة كاملة.",
      ],
    },
    projects: allProjects,
    followUps: [
      { label: L("Which project are you most proud of?", "أي مشروع تفتخرين فيه أكثر؟"), targetId: "proud" },
      { label: L("How do these connect to your journey?", "وش علاقتها بمسيرتك؟"), targetId: "journey" },
    ],
  },

  proud: {
    id: "proud",
    triggers: {
      en: ["proud", "favorite project", "best project"],
      ar: ["تفتخرين", "المشروع المفضل", "أفضل مشروع"],
    },
    paragraphs: {
      en: [
        "Probably Relay. It's the least flashy of the three, but it's the one built on a real constraint — no model call on the happy path — and getting that to feel just as fluid as an AI-backed flow took the most craft.",
        "It's also the direct ancestor of how this portfolio works: everything you're clicking through right now is the same deterministic-graph idea, just pointed at a different problem.",
      ],
      ar: [
        "غالباً ريلاي. هو أقلهم بريقاً، بس هو الوحيد المبني على قيد حقيقي: ولا استدعاء لأي نموذج في المسار الطبيعي. وخلّيه يحس سلس مثل أي تجربة مدعومة بالذكاء الاصطناعي كان أصعب جزء.",
        "وهو نفسه أصل الفكرة اللي يشتغل فيها هالموقع: كل اللي تتصفحه الحين نفس المبدأ، بس على مسألة ثانية.",
      ],
    },
    followUps: [
      { label: L("Back to projects", "رجعني للمشاريع"), targetId: "projects" },
      { label: L("How do I reach you?", "كيف أوصل لك؟"), targetId: "contact" },
    ],
  },

  journey: {
    id: "journey",
    triggers: {
      en: ["journey", "experience", "what have you been up to", "where have you worked", "resume", "cv", "programs", "training", "hackathons", "community"],
      ar: ["مسيرة", "خبرة", "ماذا فعلتِ", "أين عملتِ", "السيرة الذاتية", "برامج", "تدريب", "هاكاثون", "مجتمع"],
    },
    paragraphs: {
      en: [
        "My work comes out of a few different places — school, a couple of programs, a hackathon, and a community I help run. Here's the shape of it.",
      ],
      ar: [
        "شغلي طلع من أماكن متفرقة: الجامعة، برنامجين، هاكاثون، ومجتمع أساعد في إدارته. هذي الصورة العامة.",
      ],
    },
    experiences: allExperiences,
    followUps: [
      { label: L("What have you done outside university?", "وش سويتي خارج الجامعة؟"), targetId: "journey-outside" },
      { label: L("Show me the related projects", "ورّيني المشاريع المرتبطة"), targetId: "projects" },
    ],
  },

  "journey-outside": {
    id: "journey-outside",
    triggers: {
      en: ["outside university", "extracurricular", "clubs and hackathons"],
      ar: ["خارج الجامعة", "أنشطة إضافية", "الأندية والهاكاثونات"],
    },
    paragraphs: {
      en: [
        "Outside of coursework, most of it comes down to a community I help organize and one hackathon that turned into a real project.",
      ],
      ar: [
        "بعيداً عن المواد الدراسية، أغلبه مجتمع أساعد في تنظيمه، وهاكاثون طلع منه مشروع حقيقي.",
      ],
    },
    experiences: allExperiences.filter(
      (entry) => entry.category === "community" || entry.category === "hackathon",
    ),
    followUps: [
      { label: L("See everything", "ورّيني الكل"), targetId: "journey" },
      { label: L("Show me the related projects", "ورّيني المشاريع المرتبطة"), targetId: "projects" },
    ],
  },

  skills: {
    id: "skills",
    triggers: {
      en: ["skill", "skills", "stack", "tech stack", "technology", "technologies", "tools", "what do you use"],
      ar: ["مهارة", "مهارات", "أدوات", "تقنيات", "ما الذي تستخدمينه"],
    },
    paragraphs: {
      en: [
        "My day-to-day splits between applied AI tooling and front-end craft — I try to hold both to the same bar.",
      ],
      ar: [
        "يومي مقسوم بين أدوات الذكاء الاصطناعي وحرفية الواجهات، وأحاول أطبّق نفس المستوى على الاثنين.",
      ],
    },
    techTags: [
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "LLM Orchestration",
      "Vector Search",
      "WebGL",
      "Framer Motion",
      "PostgreSQL",
      "FastAPI",
    ],
    followUps: [
      { label: L("Show me your work", "ورّيني شغلك"), targetId: "projects" },
      { label: L("How do I reach you?", "كيف أوصل لك؟"), targetId: "contact" },
    ],
  },

  contact: {
    id: "contact",
    triggers: {
      en: ["contact", "email", "reach you", "hire", "get in touch", "linkedin", "work together"],
      ar: ["تواصل", "بريد", "الوصول إليك", "توظيف", "لينكدإن", "العمل معاً"],
    },
    paragraphs: {
      en: [
        "Best way to reach me is email — I read everything and reply quickly. Happy to talk about roles, freelance work, or just interface ideas.",
      ],
      ar: [
        "أسهل طريقة توصلني هي الإيميل، أقرأ كل شي وأرد بسرعة. يسعدني نتكلم عن وظيفة، شغل حر، أو حتى مجرد أفكار عن الواجهات.",
      ],
    },
    contact: [
      { channel: "email", label: L("Email", "الإيميل"), value: EMAIL },
      { channel: "linkedin", label: L("LinkedIn", "لينكدإن"), value: "https://linkedin.com" },
      { channel: "github", label: L("GitHub", "غيت هَب"), value: "https://github.com" },
    ],
    cta: [{ label: L("Send an email", "راسلني على الإيميل"), url: EMAIL, variant: "primary" }],
  },

  /** Reached when nothing matches confidently — never a fabricated answer. */
  fallback: {
    id: "fallback",
    paragraphs: {
      en: [
        "That's a good one — I'd rather answer it properly myself than guess at it here.",
        "Send it over and I'll get back to you personally.",
      ],
      ar: [
        "سؤال حلو — أفضّل أرد عليه بنفسي بدل ما أخمّن هنا.",
        "أرسله لي وبرد عليك شخصياً.",
      ],
    },
    cta: [{ label: L("Send me your question", "أرسل لي سؤالك"), url: EMAIL, variant: "primary" }],
    followUps: [
      { label: L("Who are you?", "عرّفيني بنفسك"), targetId: "me" },
      { label: L("Show me your work", "ورّيني شغلك"), targetId: "projects" },
    ],
  },
};

export function getNode(id: string): ConversationNode {
  return conversationNodes[id] ?? conversationNodes.fallback;
}
