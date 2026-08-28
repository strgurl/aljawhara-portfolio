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
 *
 * Ordered most recent first. Deliberately selective: this is not a CV dump.
 * One-off attendance, ordinary workshops, online certificates and short courses
 * with no output stay out. Where one experience produced several contributions,
 * they live inside it as highlights rather than becoming timeline entries.
 *
 * `professional` stays supported in the model even though nothing uses it yet.
 */
export const experiencesById: Record<string, ExperienceEntry> = {
  "exir-hub": {
    id: "exir-hub",
    category: "community",
    organization: L("Exir Hub", "نادي إكسير هب"),
    role: L("Project Management Committee Member", "عضوة لجنة إدارة المشاريع"),
    startDate: L("August 2026", "أغسطس ٢٠٢٦"),
    endDate: L("Present", "الآن"),
    // New enough that there is nothing to list yet, and that is fine. No
    // filler stands in for contributions that haven't happened.
  },

  "ai-champions": {
    id: "ai-champions",
    category: "hackathon",
    organization: L(
      "AI Champions · Tuwaiq Academy + Google for Developers",
      "AI Champions · أكاديمية طويق وGoogle for Developers",
    ),
    role: L("Tourism AI Track", "مسار السياحة"),
    outcome: L("2nd Place", "المركز الثاني"),
    startDate: L("August 2026", "أغسطس ٢٠٢٦"),
    description: L(
      "An intensive challenge where we built UMBRA as a prototype in two to three days, and the project placed 2nd in the Tourism track.",
      "تحدي مكثف بنينا خلاله UMBRA كنموذج أولي خلال يومين إلى ثلاثة، وحصل المشروع على المركز الثاني في مسار السياحة.",
    ),
    body: {
      en: [
        "We took part in the Tourism track at AI Champions, run by Tuwaiq Academy and Google for Developers. In two to three days we built UMBRA from an idea into a demo-ready MVP, and placed 2nd in the track.",
      ],
      ar: [
        "شاركنا في مسار السياحة ضمن AI Champions من أكاديمية طويق وGoogle for Developers. خلال يومين إلى ثلاثة بنينا UMBRA من الفكرة إلى MVP قابل للعرض، وحصلنا على المركز الثاني في المسار.",
      ],
    },
  },

  /**
   * A student club at PNU. Unrelated to the Tuwaiq Academy bootcamp below,
   * despite the shared name — different organisation, different category.
   */
  "tuwaiq-club": {
    id: "tuwaiq-club",
    category: "community",
    organization: L(
      "Tuwaiq Student Club · Princess Nourah University",
      "نادي طويق الطلابي · جامعة الأميرة نورة",
    ),
    role: L("AI Committee Member", "عضوة لجنة الذكاء الاصطناعي"),
    startDate: L("May 2026", "مايو ٢٠٢٦"),
    endDate: L("Present", "الآن"),
    description: L(
      "Contributing to the committee's technical programmes and bootcamp activities.",
      "المشاركة في برامج اللجنة التقنية وأنشطة المعسكرات.",
    ),
    highlights: [
      {
        id: "intro-to-ai",
        title: L("Introduction to Artificial Intelligence", "برنامج مدخل إلى الذكاء الاصطناعي"),
        description: L(
          "Took part in delivering the programme.",
          "شاركت في تقديم البرنامج.",
        ),
        link: {
          label: L("View post", "عرض المنشور"),
          url: "https://www.linkedin.com/posts/jawharaal_%D8%B3%D8%B9%D8%AF%D8%AA-%D8%AC%D8%AF%D8%A7-%D8%A8%D8%AA%D9%82%D8%AF%D9%8A%D9%85-%D9%88%D8%B1%D8%B4%D8%AA%D9%8A%D9%86-%D8%B6%D9%85%D9%86-%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC-%D9%85%D8%AF%D8%AE%D9%84-%D8%A5%D9%84%D9%89-activity-7483100510212964353-GYv9",
          icon: "linkedin",
        },
      },
      {
        id: "ai-models-bootcamp",
        title: L("AI Model Building Bootcamp", "معسكر بناء نماذج الذكاء الاصطناعي"),
        description: L(
          "Part of the organising and activities side of the bootcamp. As one of its activities I built an interactive educational game for the students taking part.",
          "كنت ضمن الجانب التنظيمي وأنشطة المعسكر، ومن ضمن الأنشطة بنيت لعبة تعليمية تفاعلية للطالبات المشاركات.",
        ),
      },
    ],
  },

  "xr-bootcamp": {
    id: "xr-bootcamp",
    category: "program",
    organization: L("Tuwaiq Academy", "أكاديمية طويق"),
    role: L("XR Development Bootcamp", "معسكر تطوير XR"),
    startDate: L("July – August 2025", "يوليو – أغسطس ٢٠٢٥"),
    location: L("Riyadh, Saudi Arabia", "الرياض، السعودية"),
    description: L(
      "A hands-on bootcamp in building AR, VR and MR experiences with Unity and XR tooling.",
      "معسكر عملي في تطوير تجارب AR وVR وMR باستخدام Unity وأدوات XR.",
    ),
    body: {
      en: [
        "A hands-on bootcamp focused on building AR, VR and MR experiences with Unity and XR tooling, and my first real step into immersive development.",
        "During the bootcamp I tried out ideas and built a lot of prototypes, some of them never meant as more than an experiment. The two we took furthest were VRLingo and AR Recipe.",
      ],
      ar: [
        "معسكر عملي ركز على تطوير تجارب AR وVR وMR باستخدام Unity وأدوات XR، وكان أول دخول فعلي لي لعالم تطوير التجارب الغامرة.",
        "خلال المعسكر جرّبت أفكارًا وبنيت نماذج كثيرة، وبعضها ما كان الهدف منه أكثر من التجربة والتعلّم. المشروعان اللي كملناهما بشكل أوضح كانا VRLingo وAR Recipe.",
      ],
    },
  },

  pnu: {
    id: "pnu",
    category: "education",
    organization: L(
      "Princess Nourah Bint Abdulrahman University",
      "جامعة الأميرة نورة بنت عبدالرحمن",
    ),
    role: L("BSc in Artificial Intelligence", "بكالوريوس الذكاء الاصطناعي"),
    startDate: L("2023", "٢٠٢٣"),
    endDate: L("2027 (expected)", "٢٠٢٧ (متوقع)"),
    location: L("Riyadh, Saudi Arabia", "الرياض، السعودية"),
    // No description: the degree, the dates and the university say all of it.
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
