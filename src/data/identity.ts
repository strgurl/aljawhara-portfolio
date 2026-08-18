import { L, type Localized } from "@/lib/i18n";

export const identity: {
  name: Localized;
  greeting: Localized;
  role: Localized;
} = {
  name: L("Jawhara", "جوهرة"),
  greeting: L("Hey, I'm Jawhara", "هلا، أنا جوهرة"),
  role: L("AI Engineer", "مهندسة ذكاء اصطناعي"),
};

export const ui = {
  inputPlaceholder: L("Ask me anything…", "اسألني عن أي شي…"),
  send: L("Send", "إرسال"),
  askLabel: L("Ask a question", "اطرح سؤالاً"),
  hideTopics: L("Hide quick questions", "إخفاء الاقتراحات"),
  showTopics: L("Show quick questions", "عرض الاقتراحات"),
  closeDetails: L("Close details", "إغلاق التفاصيل"),
  thinking: L("Typing", "تكتب…"),
  /** Shown above an answer when the match was only approximate. */
  uncertain: L(
    "I might not have caught that exactly — but this feels like the closest thing.",
    "يمكن ما فهمت سؤالك بالضبط، بس أحس هذا أقرب شي ممكن يفيدك.",
  ),
  /** Closes an approximate answer with a way to reach a real reply. */
  uncertainExit: L(
    "If that wasn't quite what you meant, ask me directly and I'll get back to you.",
    "وإذا مو هذا اللي تقصده، اسألني مباشرة وبرد عليك بأقرب وقت.",
  ),
  askDirectly: L("Ask me directly", "اسألني مباشرة"),
  backHome: L("Back to the start", "رجوع للبداية"),
  language: L("Language", "اللغة"),
  scrollLeft: L("Scroll projects left", "تمرير المشاريع لليسار"),
  scrollRight: L("Scroll projects right", "تمرير المشاريع لليمين"),
};

/** Labels used inside the project / experience detail sheets. */
export const sheet = {
  technologies: L("Technologies", "التقنيات"),
  skills: L("Skills", "المهارات"),
  links: L("Links", "روابط"),
  builtAt: L("Built at", "طلع من"),
  workFrom: L("Work from this experience", "شغل طلع من هنا"),
};
