import { L, type Locale } from "@/lib/i18n";
import type { ExperienceCategory, ExperienceCategoryMeta, ExperienceEntry } from "@/types/journey";

export const experienceCategoryMeta: Record<ExperienceCategory, ExperienceCategoryMeta> = {
  education: { label: L("Education", "التعليم"), icon: "cap", colorVar: "--color-tone-education" },
  professional: {
    label: L("Professional Experience", "الخبرة المهنية"),
    icon: "briefcase",
    colorVar: "--color-tone-professional",
  },
  program: {
    label: L("Programs & Training", "البرامج والتدريب"),
    icon: "flag",
    colorVar: "--color-tone-program",
  },
  community: { label: L("Community", "المجتمع"), icon: "users", colorVar: "--color-tone-community" },
  hackathon: {
    label: L("Hackathons & Challenges", "الهاكاثونات والتحديات"),
    icon: "spark",
    colorVar: "--color-tone-hackathon",
  },
};

/**
 * Single source of truth for Journey entries. Projects reference these by id;
 * the reverse is derived in lib/relationships.ts, never stored here.
 *
 * EN and AR are authored separately, not translated from one another.
 */
export const experiencesById: Record<string, ExperienceEntry> = {
  "edu-university": {
    id: "edu-university",
    category: "education",
    organization: L("Placeholder University", "جامعة تجريبية"),
    role: L("B.Sc. in Computer Science", "بكالوريوس علوم الحاسب"),
    startDate: L("2021", "٢٠٢١"),
    endDate: L("2025", "٢٠٢٥"),
    location: L("Remote", "عن بُعد"),
    description: L(
      "Coursework spanning systems, algorithms and applied machine learning, with a thesis project exploring interface design for AI-heavy tools.",
      "مقررات تشمل الأنظمة والخوارزميات وتعلم الآلة التطبيقي، مع مشروع تخرج يستكشف تصميم الواجهات للأدوات المعتمدة على الذكاء الاصطناعي.",
    ),
    highlights: {
      en: [
        "Thesis on conversational interface patterns for technical tools",
        "Teaching assistant for an intro programming course",
      ],
      ar: [
        "أطروحة عن أنماط الواجهات الحوارية للأدوات التقنية",
        "مساعدة تدريس لمقرر البرمجة التمهيدي",
      ],
    },
    skills: ["Algorithms", "Systems Design", "Applied ML"],
  },

  "prof-internship": {
    id: "prof-internship",
    category: "professional",
    organization: L("Placeholder Tech Co.", "شركة تقنية تجريبية"),
    role: L("Software Engineer Intern", "متدربة هندسة برمجيات"),
    startDate: L("Summer 2025", "صيف ٢٠٢٥"),
    location: L("Remote", "عن بُعد"),
    description: L(
      "Joined the applied AI team to help ship a research-facing product surface — most of the interaction design work that became Aurora started here.",
      "انضممت لفريق الذكاء الاصطناعي التطبيقي للمساعدة في إطلاق واجهة منتج بحثية — معظم عمل تصميم التفاعل الذي أصبح أورورا بدأ هنا.",
    ),
    highlights: {
      en: [
        "Shipped the first working version of Aurora's citation-linking engine",
        "Paired closely with design on the conversational interaction model",
      ],
      ar: [
        "أطلقت أول نسخة عاملة من محرك ربط المراجع في أورورا",
        "عملت عن قرب مع فريق التصميم على نموذج التفاعل الحواري",
      ],
    },
    skills: ["TypeScript", "React", "LLM Orchestration"],
    relatedProjectIds: ["aurora"],
  },

  "program-fellowship": {
    id: "program-fellowship",
    category: "program",
    organization: L("Placeholder Academy", "أكاديمية تجريبية"),
    role: L("AI Builder Fellowship", "زمالة بناء الذكاء الاصطناعي"),
    startDate: L("2024", "٢٠٢٤"),
    endDate: L("2024", "٢٠٢٤"),
    description: L(
      "A selective, project-based technical program focused on shipping applied AI products end to end rather than studying them in the abstract.",
      "برنامج تقني انتقائي قائم على المشاريع، يركز على إطلاق منتجات ذكاء اصطناعي تطبيقية من البداية للنهاية بدل دراستها نظرياً.",
    ),
    highlights: {
      en: [
        "Built Relay as the capstone project, from architecture through deployment",
        "One of a small cohort selected from an applicant pool of several hundred",
      ],
      ar: [
        "بنيت ريلاي كمشروع تخرج، من التصميم المعماري حتى النشر",
        "ضمن دفعة صغيرة اختيرت من بين عدة مئات من المتقدمين",
      ],
    },
    skills: ["Python", "FastAPI", "Product Thinking"],
    relatedProjectIds: ["relay"],
  },

  "community-organizer": {
    id: "community-organizer",
    category: "community",
    organization: L("Placeholder Dev Community", "مجتمع مطورين تجريبي"),
    role: L("Core Organizer", "منظِّمة أساسية"),
    startDate: L("2023", "٢٠٢٣"),
    description: L(
      "Helped run a student developer community — workshops, project nights, and a lot of quiet infrastructure work to keep things running.",
      "ساعدت في إدارة مجتمع مطورين طلابي — ورش عمل وأمسيات مشاريع، والكثير من العمل التنظيمي الهادئ لإبقاء الأمور تسير.",
    ),
    highlights: {
      en: ["Organized a recurring build-night series", "Mentored newer members on their first projects"],
      ar: ["نظمت سلسلة أمسيات بناء دورية", "أرشدت الأعضاء الجدد في مشاريعهم الأولى"],
    },
    skills: ["Community Building", "Mentorship"],
  },

  "hackathon-2024": {
    id: "hackathon-2024",
    category: "hackathon",
    organization: L("Placeholder Hackathon 2024", "هاكاثون تجريبي ٢٠٢٤"),
    role: L("Winner — Best Creative Use of Tech", "الفائزة — أفضل استخدام إبداعي للتقنية"),
    startDate: L("2024", "٢٠٢٤"),
    location: L("On-site", "حضورياً"),
    description: L(
      "A 36-hour build sprint. Lumen started here as a rough shader experiment and became the most-referenced project on my portfolio since.",
      "سباق بناء لمدة ٣٦ ساعة. بدأ لومن هنا كتجربة شيدر أولية وأصبح أكثر مشاريعي إشارةً منذ ذلك الحين.",
    ),
    highlights: {
      en: ["Built and shipped Lumen in 36 hours", "Presented to a panel of industry judges"],
      ar: ["بنيت وأطلقت لومن خلال ٣٦ ساعة", "قدمت العرض أمام لجنة تحكيم من الصناعة"],
    },
    skills: ["WebGL", "Rapid Prototyping"],
    relatedProjectIds: ["lumen"],
  },
};

export const allExperiences: ExperienceEntry[] = Object.values(experiencesById);

/** Dates read start→end in both scripts; direction is handled by the layout. */
export function formatDateRange(entry: ExperienceEntry, locale: Locale): string | undefined {
  const start = entry.startDate?.[locale];
  const end = entry.endDate?.[locale];
  if (start && end) return `${start} – ${end}`;
  return start ?? end;
}
