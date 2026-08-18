import { L } from "@/lib/i18n";
import type { ProjectCard } from "@/types/conversation";

/**
 * Single source of truth for project data. Conversation nodes reference
 * entries from here rather than embedding their own copies.
 *
 * EN and AR are authored separately, not translated from one another.
 */
export const projectsById: Record<string, ProjectCard> = {
  aurora: {
    id: "aurora",
    eyebrow: L("AI Product", "منتج ذكاء اصطناعي"),
    title: "Aurora",
    ground: "graphite",
    year: "2025",
    summary: L("A reasoning copilot for research teams.", "مساعد تفكير لفرق البحث."),
    description: L(
      "Aurora turns a sprawling research workspace into a single conversational surface — surfacing citations, contradictions and gaps across hundreds of documents in real time, without ever feeling like a search bar.",
      "يحوّل أورورا مساحة بحث متشعبة إلى واجهة محادثة واحدة، تُبرز المراجع والتناقضات والفجوات عبر مئات المستندات في الوقت الفعلي، دون أن يبدو كشريط بحث.",
    ),
    tags: ["TypeScript", "React", "Vector Search", "LLM Orchestration", "Node.js"],
    links: [
      { label: L("Case study", "دراسة الحالة"), url: "#", icon: "link" },
      { label: L("Live demo", "عرض مباشر"), url: "#", icon: "play" },
    ],
    experienceIds: ["prof-internship"],
  },
  lumen: {
    id: "lumen",
    eyebrow: L("Creative Build", "عمل إبداعي"),
    title: "Lumen",
    ground: "plum",
    year: "2024",
    summary: L("A generative lighting toy for the browser.", "أداة إضاءة توليدية للمتصفح."),
    description: L(
      "An experiment in real-time procedural light — visitors sculpt a lightfield with cursor and touch, rendered entirely on the GPU at 60fps. Built as a personal study in shader-driven interaction design.",
      "تجربة في الضوء الإجرائي الفوري — يشكّل الزائر حقلاً ضوئياً بالمؤشر واللمس، يُعرض بالكامل على المعالج الرسومي بمعدل 60 إطاراً. بُني كدراسة شخصية في تصميم التفاعل المعتمد على الشيدرز.",
    ),
    tags: ["WebGL", "GLSL", "Three.js", "Framer Motion"],
    links: [
      { label: L("Live demo", "عرض مباشر"), url: "#", icon: "play" },
      { label: L("Source", "الشيفرة"), url: "#", icon: "github" },
    ],
    experienceIds: ["hackathon-2024"],
  },
  relay: {
    id: "relay",
    eyebrow: L("Applied AI", "ذكاء اصطناعي تطبيقي"),
    title: "Relay",
    ground: "pine",
    year: "2024",
    summary: L(
      "Deterministic conversation infra for support teams.",
      "بنية محادثة حتمية لفرق الدعم.",
    ),
    description: L(
      "A support automation layer that resolves the 80% of tickets that don't need a model at all — structured, auditable decision trees with an LLM fallback only at the true edge. This portfolio's chat engine is a distant cousin of it.",
      "طبقة أتمتة دعم تحل 80% من التذاكر التي لا تحتاج نموذجاً إطلاقاً — أشجار قرار منظمة وقابلة للتدقيق، مع الرجوع إلى نموذج لغوي في الحالات النادرة فقط. محرك المحادثة في هذا الملف قريب منه.",
    ),
    tags: ["Python", "FastAPI", "PostgreSQL", "React"],
    links: [{ label: L("Case study", "دراسة الحالة"), url: "#", icon: "link" }],
    experienceIds: ["program-fellowship"],
  },
};

export const allProjects: ProjectCard[] = Object.values(projectsById);
