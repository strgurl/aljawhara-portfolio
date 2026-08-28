import { L, type Localized } from "@/lib/i18n";

export const identity: {
  name: Localized;
  greeting: Localized;
  role: Localized;
} = {
  name: L("Aljawhara", "الجوهرة"),
  greeting: L("Hi, I'm Aljawhara. Glad you're here", "السلام عليكم، أنا الجوهرة"),
  role: L("AI Engineer", "مهندسة ذكاء اصطناعي"),
};

export const ui = {
  inputPlaceholder: L("Ask me anything…", "اسألني عن أي شيء…"),
  send: L("Send", "إرسال"),
  askLabel: L("Ask a question", "اسأل سؤال"),
  hideTopics: L("Hide quick questions", "إخفاء الاقتراحات"),
  showTopics: L("Show quick questions", "عرض الاقتراحات"),
  closeDetails: L("Close", "إغلاق"),
  /** Names the detail sheet for screen readers, which never see its heading. */
  detailsLabel: L("Details", "التفاصيل"),
  thinking: L("Typing", "تكتب…"),
  /**
   * Shown above an approximate answer. Deliberately light: an approximate match
   * is usually right, so it should read as a check rather than a failure.
   */
  uncertain: L("Did you mean this?", "يمكن تقصد هذا؟"),
  /** Closes an approximate answer with a way to reach a real reply. */
  uncertainExit: L("Not what you meant?", "مو هذا اللي تقصده؟"),
  /** Opens a mail composer carrying the visitor's question. Never a hop. */
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
  links: L("Links", "الروابط"),
  builtAt: L("Part of", "ضمن"),
  workFrom: L("Projects from this experience", "مشاريع من هذه التجربة"),
};
