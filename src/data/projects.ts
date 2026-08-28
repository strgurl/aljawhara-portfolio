import { L } from "@/lib/i18n";
import type { ProjectCard } from "@/types/conversation";

/**
 * Single source of truth for project data. Conversation nodes reference
 * entries from here rather than embedding their own copies.
 *
 * Arabic is the source of truth for intent and tone; English is written to
 * match the meaning naturally rather than translated from it.
 *
 * Each project explains itself in its own shape. There is deliberately no
 * repeating template of "my role / outcome / release" headings — what matters
 * is folded into the description, and every card closes on technologies and,
 * where they exist, links.
 */
/**
 * Real headset captures from the VR build. Two of them carry the in-experience
 * task list in Arabic, but there is no English capture of the same moments, so
 * the same three are shown in both languages rather than inventing a second set.
 */
const vrlingoGallery = [
  {
    src: "/projects/vrlingo/new-york.jpg",
    alt: L(
      "A New York street inside the experience, with a taxi, a passer-by and a floating list of things to try.",
      "شارع في نيويورك داخل التجربة، فيه تاكسي وشخص يمشي وقائمة مهام معلقة في الهواء.",
    ),
  },
  {
    src: "/projects/vrlingo/mexico.jpg",
    alt: L(
      "Looking through stone arches onto the Mexican square, with a floating list of things to try.",
      "إطلالة من تحت أقواس حجرية على ساحة مكسيكية، وقائمة مهام معلقة في الهواء.",
    ),
  },
  {
    src: "/projects/vrlingo/mexico-pinata.jpg",
    alt: L(
      "A piñata strung across the square next to a sign inviting you to hit it, with items scattered below.",
      "بينياتا معلقة في الساحة وجنبها لوحة تدعوك تضربها، وتحتها أشياء متناثرة.",
    ),
  },
];

/**
 * Screens from the deployed build. The product's interface is English only, so
 * the same four are shown in both locales rather than duplicating files; only
 * the alt text is localized.
 */
const taazurGallery = [
  {
    src: "/projects/taazur/dashboard.png",
    alt: L(
      "The Taazur dashboard with a completed student profile and the next steps to find a team.",
      "لوحة تآزر مع ملف طالبة مكتمل والخطوات التالية لتكوين فريق.",
    ),
  },
  {
    src: "/projects/taazur/find-teammates.png",
    alt: L(
      "The matching screen: skills I have on one side, skills I need on the other, and ranked results showing how many of the needed skills each person covers.",
      "شاشة المطابقة: المهارات اللي عندي في جهة، واللي أحتاجها في جهة، والنتائج مرتبة مع عدد المهارات اللي يغطيها كل شخص.",
    ),
  },
  {
    src: "/projects/taazur/join-request.png",
    alt: L(
      "The teams screen with a pending join request waiting to be accepted or declined.",
      "شاشة الفرق مع طلب انضمام معلّق بانتظار القبول أو الرفض.",
    ),
  },
  {
    src: "/projects/taazur/team-chat.png",
    alt: L(
      "A team page listing members and their combined skills, next to the team chat.",
      "صفحة الفريق وفيها الأعضاء ومهاراتهم مجتمعة، وجنبها محادثة الفريق.",
    ),
  },
];

/**
 * Phone captures of the running build, in the order the app itself moves:
 * ask, scan, suggest. The interface is English only, so both locales show the
 * same three files and only the alt text changes.
 */
const arRecipeGallery = [
  {
    src: "/projects/ar-recipe/home.png",
    alt: L(
      "The opening screen asking what is in your kitchen, with a button to start scanning.",
      "الشاشة الأولى تسأل وش عندك في المطبخ، وفيها زر يبدأ المسح.",
    ),
  },
  {
    src: "/projects/ar-recipe/scan.png",
    alt: L(
      "The camera recognizing a carton of milk, with sweet and savory options floating beside it.",
      "الكاميرا تتعرّف على كرتون حليب، وجنبه خياران: حلو أو حادق.",
    ),
  },
  {
    src: "/projects/ar-recipe/recipes.png",
    alt: L(
      "Suggested dishes for the scanned ingredient, each with its ingredients and prep and cook times.",
      "أطباق مقترحة للمكوّن اللي انمسح، وكل طبق معه مكوّناته ووقت التحضير والطبخ.",
    ),
  },
];

export const projectsById: Record<string, ProjectCard> = {
  umbra: {
    id: "umbra",
    eyebrow: L("AI Champions · Winning project", "مشروع فائز في AI Champions"),
    title: "UMBRA",
    ground: "graphite",
    year: "2026",
    summary: L(
      "Walking routes that account for shade and the time of day.",
      "مسارات مشي تراعي الظل ووقت اليوم.",
    ),
    body: {
      en: [
        "In Riyadh, a small difference in route can mean a big difference in how much of the walk is spent in the sun.",
        "UMBRA is a prototype that compares the fastest route with an alternative that favours shade, and shows how that comparison shifts with the time of day and the position of the sun. It placed 2nd in the Tourism track at AI Champions.",
      ],
      ar: [
        "في الرياض، فرق بسيط في المسار ممكن يعني فرق كبير في المشي تحت الشمس.",
        "UMBRA نموذج أولي يقارن بين المسار الأسرع ومسار بديل يراعي الظل أكثر، ويعرض لك كيف تتغير المقارنة حسب وقت اليوم وموقع الشمس. حصل المشروع على المركز الثاني في مسار السياحة ضمن AI Champions.",
      ],
    },
    sections: [
      {
        heading: L("How it works", "كيف يشتغل"),
        paragraphs: {
          en: [
            "You set a start point and a destination, and UMBRA lays out two routes to compare on walking time, shade coverage and time of day.",
            "The sun's position is calculated from the date and time. The shade data in the current version is prototype data built for the MVP rather than the result of real building geometry. Gemini sits on top as an explanation layer for the calculated numbers, without changing them or deciding the route.",
            "We built it as a team over about three days, and I led the team. The short timeline meant focusing on the MVP and choosing carefully what made it into the version we demoed.",
          ],
          ar: [
            "تحدد نقطة البداية والوجهة، ويعرض UMBRA مسارين للمقارنة من حيث مدة المشي ونسبة الظل والوقت.",
            "موقع الشمس يُحسب حسب التاريخ والوقت، أما بيانات الظل في النسخة الحالية فهي بيانات تجريبية بُنيت للـMVP وليست ناتجة عن هندسة مبانٍ فعلية. واستخدمنا Gemini كطبقة شرح للأرقام المحسوبة، بدون ما يغيّرها أو يقرر المسار.",
            "بنيناه كفريق خلال حوالي ثلاثة أيام، وكنت قائدة الفريق. الوقت القصير خلانا نركز على الـMVP ونختار بعناية وش يدخل في النسخة اللي نعرضها.",
          ],
        },
      },
    ],
    cover: {
      src: "/projects/umbra/cover.jpg",
      alt: L(
        "Two walking routes across a night map of Riyadh, one lit by sun, one shaded.",
        "مساران للمشي على خريطة ليلية للرياض، واحد تحت الشمس وواحد في الظل.",
      ),
    },
    video: {
      src: "/projects/umbra/demo.mp4",
    },
    // Interface screenshots, so each language shows its own build. The fourth
    // is the 3D shade view, which carries no interface text and is shared.
    gallery: {
      en: [
        {
          src: "/projects/umbra/gallery-en-1.png",
          alt: L("The route planner with both routes drawn on the map.", "مخطط المسارات والطريقين مرسومين على الخريطة."),
        },
        {
          src: "/projects/umbra/gallery-en-2.png",
          alt: L("Walking time, sun exposure and shade breakdown for each route.", "مدة المشي والتعرض للشمس وتوزيع الظل لكل طريق."),
        },
        {
          src: "/projects/umbra/gallery-en-3.png",
          alt: L("Gemini's explanation of the trade-off between the two routes.", "شرح Gemini للفرق بين الطريقين."),
        },
        {
          src: "/projects/umbra/gallery-shared-4.png",
          alt: L("The 3D view of the district with sun and shade at a set hour.", "العرض ثلاثي الأبعاد للمنطقة مع الشمس والظل في ساعة محددة."),
        },
      ],
      ar: [
        {
          src: "/projects/umbra/gallery-ar-1.png",
          alt: L("The route planner with both routes drawn on the map.", "مخطط المسارات والطريقين مرسومين على الخريطة."),
        },
        {
          src: "/projects/umbra/gallery-ar-2.png",
          alt: L("Walking time, sun exposure and shade breakdown for each route.", "مدة المشي والتعرض للشمس وتوزيع الظل لكل طريق."),
        },
        {
          src: "/projects/umbra/gallery-ar-3.png",
          alt: L("Gemini's explanation of the trade-off between the two routes.", "شرح Gemini للفرق بين الطريقين."),
        },
        {
          src: "/projects/umbra/gallery-shared-4.png",
          alt: L("The 3D view of the district with sun and shade at a set hour.", "العرض ثلاثي الأبعاد للمنطقة مع الشمس والظل في ساعة محددة."),
        },
      ],
    },
    tags: ["React", "TypeScript", "Leaflet", "Gemini 2.5 Flash", "Three.js", "Netlify"],
    // The repo is not public, so only the deployed build is linked.
    links: [
      {
        label: L("Live Demo", "التجربة المباشرة"),
        url: "https://umbra-riyadh.netlify.app",
        icon: "link",
      },
    ],
    experienceIds: ["ai-champions"],
  },

  vrlingo: {
    id: "vrlingo",
    eyebrow: L("XR Bootcamp · Tuwaiq Academy", "معسكر XR · أكاديمية طويق"),
    title: "VRLingo",
    ground: "plum",
    year: "2025",
    summary: L(
      "Learn a language inside an interactive VR experience.",
      "تعلّم اللغة داخل تجربة VR تفاعلية.",
    ),
    body: {
      en: [
        "VRLingo is a language-learning experience in virtual reality, instead of practice being confined to a screen and a set of ready-made questions.",
        "The journey starts at Tuwaiq Airport. You hear the boarding call, choose between New York and Mexico, and step into an environment built so that you use the language inside situations and interactions close to real life.",
      ],
      ar: [
        "VRLingo تجربة لتعلّم اللغة بالواقع الافتراضي، بدل ما تكون الممارسة محصورة في شاشة وأسئلة جاهزة.",
        "تبدأ الرحلة من مطار طويق، تسمع نداء الركاب وتختار وجهتك بين نيويورك والمكسيك، وبعدها تدخل بيئة صُممت عشان تستخدم اللغة داخل مواقف وتفاعلات قريبة من الواقع.",
      ],
    },
    sections: [
      {
        heading: L("Inside the experience", "داخل التجربة"),
        paragraphs: {
          en: [
            "In New York you speak with Convai characters in the street and the café, order and talk with them, and when you get something wrong the characters are set up to help and correct you. In the same environment we added vocabulary activities, like matching pictures to words and interacting with objects so their names and letters appear.",
            "In Mexico we tried to tie the learning to the place and the culture: a market with characters to talk to, a sombrero you can wear and learn the name of in Spanish, a piñata you can hit so items drop for you to learn their names, and music and dancing in the square.",
            "The conversational characters run on Convai. We gave each one a role, a context and a way of interacting that suits the place, so the conversation is part of the experience rather than a separate menu of options.",
            "We built it as a team over about a week at the Tuwaiq bootcamp, and the work overlapped between us from start to finish. We tried things, adjusted, and learned from each other until we had a version we could test on the headset and publish.",
          ],
          ar: [
            "في نيويورك تقدر تتفاعل بصوتك مع شخصيات Convai في الشارع والمقهى، تطلب وتتحدث معهم، وإذا أخطأت في الكلام تكون الشخصيات مهيأة لمساعدتك وتصحيحك. وفي البيئة نفسها أضفنا أنشطة للمفردات، مثل مطابقة الصور بالكلمات والتفاعل مع الأشياء لتظهر أسماؤها وحروفها.",
            "وفي المكسيك حاولنا نخلي التعلم مرتبط بالبيئة والثقافة: سوق وشخصيات تتحدث معها، قبعة مكسيكية تقدر تلبسها وتتعلم اسمها بالإسبانية، بينياتا تتفاعل معها وتسقط منها عناصر تتعلم أسماءها، وموسيقى ورقصات داخل الساحة.",
            "الشخصيات الحوارية تعمل عبر Convai. جهزنا لكل شخصية دورًا وسياقًا وطريقة تفاعل تناسب المكان، بحيث يكون الحوار جزءًا من التجربة نفسها بدل ما يكون قائمة خيارات منفصلة.",
            "بنيناه كفريق خلال حوالي أسبوع في معسكر طويق، وكان الشغل بيننا متداخل من البداية للنهاية. جرّبنا، عدّلنا، وتعلمنا من بعض لين وصلنا لنسخة نقدر نجربها على النظارة وننشرها.",
          ],
        },
      },
    ],
    cover: {
      src: "/projects/vrlingo/cover.jpg",
      alt: L(
        "Someone in a VR headset between two scenes, a New York bakery and a Mexican market.",
        "شخص يلبس نظارة واقع افتراضي بين مشهدين، مخبز في نيويورك وسوق في المكسيك.",
      ),
    },
    video: {
      src: "/projects/vrlingo/demo.mp4",
    },
    // Same captures either way: gameplay is gameplay, and no English-build
    // equivalents of these moments exist.
    gallery: { en: vrlingoGallery, ar: vrlingoGallery },
    tags: ["Unity", "C#", "XR Interaction Toolkit", "Convai", "Meta Quest"],
    // A headset build has no browser demo, so the store listing is the public
    // destination and stands alone.
    links: [
      {
        label: L("View on SideQuest", "عرض على SideQuest"),
        url: "https://sidequestvr.com/app/44202/vrlingo",
        icon: "link",
      },
    ],
    experienceIds: ["xr-bootcamp"],
  },

  taazur: {
    id: "taazur",
    eyebrow: L("University Project", "مشروع جامعي"),
    title: "Taazur",
    titleLocalized: L("Taazur", "تآزر"),
    ground: "pine",
    summary: L(
      "Build a team that completes your skills instead of repeating them.",
      "كوّن فريقًا يكمل مهاراتك، مو يكررها.",
    ),
    body: {
      en: [
        "Taazur started from a problem we run into constantly in university projects: you form the team from the people you already know, and then discover you all have the same skills and the same gaps.",
        "Taazur works the other way round. Each person sets out the skills they have and the skills they need, and the system suggests people who would complete the team better.",
      ],
      ar: [
        "تآزر بدأ من مشكلة بسيطة نواجهها كثير في المشاريع الجامعية: نكوّن الفريق من الأشخاص اللي نعرفهم أول، وبعدها نكتشف إن عندنا نفس المهارات ونفس النواقص.",
        "الفكرة في تآزر بالعكس. كل شخص يحدد مهاراته والمهارات اللي يحتاجها، والنظام يقترح أشخاص ممكن يكملون الفريق بشكل أفضل.",
      ],
    },
    sections: [
      {
        heading: L("How it works", "كيف يشتغل"),
        paragraphs: {
          en: [
            "You create a profile and set out your skills and the skills you're looking for. From there you can browse the suggestions, create a team, send or receive join requests, and keep everything going inside the app through notifications and chat.",
          ],
          ar: [
            "تنشئ ملفك وتحدد مهاراتك والمهارات اللي تبحث عنها. بعدها تقدر تشوف المقترحات، تكوّن فريق، ترسل أو تستقبل طلبات انضمام، وتكمل التواصل داخل التطبيق من خلال الإشعارات والمحادثة.",
          ],
        },
      },
      {
        heading: L("Matching", "المطابقة"),
        paragraphs: {
          en: [
            "Matching is built on complementary skills: not only what two people have in common, but how much each one covers what the other needs.",
            "We turned every pair of students into a set of compatibility features and used Gradient Boosting to rank the suggestions. Training and test data were split at the student level rather than by pair, so the same student doesn't appear on both sides.",
            "A university team project where we worked on the whole product, from the interface, sign-up, teams, requests and chat, through to the matching and ranking layer.",
          ],
          ar: [
            "المطابقة تعتمد على فكرة التكامل بين المهارات: مو بس وش عند الشخصين من مهارات مشتركة، لكن أيضًا قد إيش كل واحد يغطي احتياج الثاني.",
            "حوّلنا كل زوج من الطلاب إلى مجموعة خصائص للتوافق، واستخدمنا Gradient Boosting لترتيب الاقتراحات. وقسمنا بيانات التدريب والاختبار على مستوى الطلاب بدل الأزواج، عشان ما يظهر نفس الطالب في الجهتين.",
            "مشروع جامعي جماعي اشتغلنا فيه على المنتج كامل، من الواجهة وتسجيل المستخدمين والفرق والطلبات والمحادثات، إلى طبقة المطابقة والترتيب.",
          ],
        },
      },
    ],
    cover: {
      src: "/projects/taazur/cover.jpg",
      alt: L(
        "A team icon at the centre of a puzzle, connected to people with different skills.",
        "أيقونة فريق في وسط أحجية، متصلة بأشخاص بمهارات مختلفة.",
      ),
    },
    video: {
      src: "/projects/taazur/demo.mp4",
    },
    // Same screens either way: the product's own interface is English only.
    gallery: { en: taazurGallery, ar: taazurGallery },
    tags: ["React", "Firebase Authentication", "Firestore", "Flask", "Python", "scikit-learn"],
    // Built for a university course, so it surfaces under the degree entry in
    // Journey. Stored here only; the reverse lookup is derived.
    experienceIds: ["pnu"],
    links: [
      {
        label: L("Live Demo", "التجربة المباشرة"),
        url: "https://taazur-api.onrender.com",
        icon: "link",
      },
      {
        label: L("GitHub", "GitHub"),
        url: "https://github.com/strgurl/taazur-api",
        icon: "github",
      },
    ],
  },

  portfolio: {
    id: "portfolio",
    eyebrow: L("Personal · You're using it right now", "مشروع شخصي · أنت داخله الآن"),
    title: "This portfolio",
    titleLocalized: L("This portfolio", "هذا الموقع"),
    ground: "graphite",
    year: "2026",
    summary: L(
      "It talks back, and there's no model behind it.",
      "يرد عليك، بدون موديل يولّد الكلام.",
    ),
    body: {
      en: [
        "You're using this one right now, so rather than describing what it looks like, the part that matters is what happens behind it. The interface reads like a conversation, but the replies themselves are not generated; all of the content is written and reviewed ahead of time in Arabic and English.",
      ],
      ar: [
        "أنت تستخدم المشروع الآن، لذلك بدل ما أوصف لك شكله، الأهم هو اللي يصير خلفه. الواجهة تبدو مثل محادثة، لكن الردود نفسها مو مولّدة؛ كل محتوى الموقع مكتوب ومراجع مسبقًا بالعربي والإنجليزي.",
      ],
    },
    sections: [
      {
        heading: L("Behind the experience", "خلف التجربة"),
        paragraphs: {
          en: [
            "Each topic keeps its own conversation, so if you move between sections and come back, everything is where you left it. Arabic and English are written independently so each language reads naturally, with full RTL support.",
            "The opening background is a fluid simulation on a canvas that reacts to the pointer, and it disappears after the first question so the conversation stays quiet while you read.",
          ],
          ar: [
            "كل موضوع يحتفظ بمحادثته الخاصة، فإذا تنقلت بين الأقسام ورجعت تلقى كل شيء مثل ما تركته. العربي والإنجليزي مكتوبين بشكل مستقل عشان كل لغة تطلع بطبيعتها، مع دعم كامل لاتجاه RTL.",
            "أما خلفية البداية فهي محاكاة سوائل على Canvas تتفاعل مع حركة المؤشر، وتختفي بعد أول سؤال عشان تظل واجهة المحادثة هادئة أثناء القراءة.",
          ],
        },
      },
      {
        heading: L("Why the replies aren't generated", "ليش الردود مو مولّدة؟"),
        paragraphs: {
          en: [
            "Because that was the right fit for a personal portfolio. I want the reply to be instant, with no cost and no usage limits, and more importantly for everything written about me to stay in my own voice, with no chance of the system adding something that isn't there.",
            "Free typing still stays. A question is understood locally and routed to the closest thing I've already written, and when the match isn't good enough it doesn't guess.",
          ],
          ar: [
            "لأن هذا كان الأنسب لبورتفوليو شخصي. أبي الرد يكون سريع، بدون تكلفة أو حدود استخدام، والأهم يظل كل شيء مكتوب عني بصوتي ومن غير احتمال إن النظام يضيف معلومة مو موجودة.",
            "مع ذلك، خليت الكتابة الحرة موجودة. السؤال ينفهم محليًا ويتوجه لأقرب محتوى كتبته مسبقًا، وإذا ما كان التطابق كافي ما يخمّن.",
          ],
        },
      },
      {
        heading: L("How it understands your question", "كيف يفهم سؤالك؟"),
        paragraphs: {
          en: [
            "When you type a question, the system cleans up the text and compares it against phrasings tied to the existing content. Then it decides how confident the match is.",
            "A clear match opens the answer directly. A close but uncertain one gives you the nearest thing that might help. And when it hasn't understood well enough, it doesn't guess, and points you to me instead.",
          ],
          ar: [
            "لما تكتب سؤال، النظام ينظف النص ويقارنه بصيغ وعبارات مرتبطة بالمحتوى الموجود. بعدها يحدد مستوى الثقة في التطابق.",
            "إذا كان التطابق واضح يفتح الإجابة مباشرة. وإذا كان قريب لكنه مو مؤكد، يعطيك أقرب شيء ممكن يفيدك. وإذا ما فهم السؤال بشكل كافٍ، ما يخمّن ويوجهك للتواصل معي.",
          ],
        },
      },
    ],
    cover: {
      src: "/projects/portfolio/cover.jpg",
      alt: L(
        "A glass conversation panel of message bubbles over drifting light.",
        "لوحة محادثة زجاجية فيها فقاعات رسائل فوق ضوء متحرك.",
      ),
    },
    tags: [
      "React",
      "TypeScript",
      "Local intent matching",
      "Canvas 2D fluid simulation",
      "Bilingual RTL",
    ],
  },

  /**
   * Unfinished, and shown as such. `status` also quiets the card so it reads as
   * work in progress rather than something being presented as done.
   */
  "fan-al-kabsa": {
    id: "fan-al-kabsa",
    eyebrow: L("Personal project", "مشروع شخصي"),
    title: "Fan Al Kabsa",
    titleLocalized: L("Fan Al Kabsa", "فن الكبسة"),
    status: L("In progress", "قيد التطوير"),
    ground: "pine",
    summary: L(
      "A restaurant simulation I'm building in Roblox.",
      "لعبة محاكاة مطعم أبنيها في Roblox.",
    ),
    body: {
      en: [
        "A personal restaurant simulation built in Roblox Studio with Luau. It's an exploratory side project rather than something planned out in advance, and it isn't finished yet.",
      ],
      ar: [
        "لعبة محاكاة مطعم شخصية مبنية في Roblox Studio باستخدام Luau. مشروع جانبي استكشافي أكثر من كونه شي مخطط له من البداية، وللحين ما اكتمل.",
      ],
    },
    cover: {
      src: "/projects/fan-al-kabsa/cover.jpg",
      alt: L(
        "A Roblox chef serving a plate of kabsa to a customer at a restaurant counter.",
        "طباخ في Roblox يقدم صحن كبسة لزبون على طاولة مطعم.",
      ),
    },
    tags: ["Roblox Studio", "Luau"],
    // Screenshot pending.
  },

  /**
   * Journey-only. Reached from the XR bootcamp entry rather than the Work grid,
   * because it belongs to that experience rather than standing on its own.
   */
  "ar-recipe": {
    id: "ar-recipe",
    eyebrow: L("XR Bootcamp", "معسكر XR"),
    title: "AR Recipe",
    ground: "pine",
    year: "2025",
    showInWork: false,
    summary: L(
      "An AR experiment that recognises an ingredient and suggests recipes to match the user's preferences.",
      "تجربة AR تتعرف على مكوّن وتقترح وصفات تناسب تفضيلات المستخدم.",
    ),
    body: {
      en: [
        "An augmented reality experience built with Unity and Vuforia Model Target. It recognises an ingredient, takes the user's preferences and allergies into account, then suggests suitable dishes and shows the result inside an AR experience.",
      ],
      ar: [
        "تجربة واقع معزز مبنية باستخدام Unity وVuforia Model Target. تتعرف على مكوّن، تأخذ تفضيلات المستخدم والحساسيات بعين الاعتبار، ثم تقترح أطباقًا مناسبة وتعرض النتيجة داخل تجربة AR.",
      ],
    },
    cover: {
      src: "/projects/ar-recipe/cover.jpg",
      alt: L(
        "A bell pepper scanned on a board, with suggested dishes floating beside it.",
        "فلفل على لوح تقطيع يتم التعرف عليه، وبجانبه أطباق مقترحة.",
      ),
    },
    video: {
      src: "/projects/ar-recipe/demo.mp4",
    },
    // Phone captures of the real build; the app's interface is English only.
    gallery: { en: arRecipeGallery, ar: arRecipeGallery },
    tags: ["Unity", "C#", "Vuforia Model Target", "AR"],
    experienceIds: ["xr-bootcamp"],
  },
};

export const allProjects: ProjectCard[] = Object.values(projectsById);

/** What the Work section shows. Journey-only and staged work stays out. */
export const workProjects: ProjectCard[] = allProjects.filter(
  (project) => project.showInWork !== false,
);
