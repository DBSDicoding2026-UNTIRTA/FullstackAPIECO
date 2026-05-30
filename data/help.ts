import { teamData } from "@/data/team";

export type HelpLanguage = "id" | "en";

export interface HelpGuideItem {
  readonly title: string;
  readonly description: string;
  readonly steps: readonly string[];
}

export interface HelpFaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface HelpContactInfo {
  readonly email: string;
  readonly githubUrl: string;
  readonly teamTitle: string;
  readonly teamDescription: string;
  readonly responseTime: string;
  readonly members: readonly {
    readonly id: string;
    readonly name: string;
    readonly role: string;
  }[];
}

export interface HelpContent {
  readonly panelTitle: string;
  readonly panelDescription: string;
  readonly tabs: {
    readonly guide: string;
    readonly faq: string;
    readonly contact: string;
    readonly report: string;
  };
  readonly guide: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly HelpGuideItem[];
  };
  readonly faq: {
    readonly title: string;
    readonly description: string;
    readonly items: readonly HelpFaqItem[];
  };
  readonly contact: HelpContactInfo;
  readonly report: {
    readonly title: string;
    readonly description: string;
    readonly titleLabel: string;
    readonly titlePlaceholder: string;
    readonly descriptionLabel: string;
    readonly descriptionPlaceholder: string;
    readonly submit: string;
    readonly submitting: string;
    readonly successTitle: string;
    readonly successDescription: string;
    readonly emptyTitle: string;
    readonly emptyDescription: string;
  };
}

const supportMembers = teamData.map((member) => ({
  id: member.id,
  name: member.name,
  role: member.role,
}));

export const helpContent: Record<HelpLanguage, HelpContent> = {
  id: {
    panelTitle: "Need Help?",
    panelDescription:
      "Temukan panduan cepat, jawaban FAQ, kontak tim, dan kanal pelaporan masalah PilahYuk.",
    tabs: {
      guide: "Panduan",
      faq: "FAQ",
      contact: "Kontak",
      report: "Lapor",
    },
    guide: {
      title: "Panduan Penggunaan",
      description: "Alur singkat untuk fitur utama yang paling sering dipakai.",
      items: [
        {
          title: "Cara menggunakan AI Scanner",
          description: "Gunakan AI Analyst untuk mengenali kategori sampah dari gambar.",
          steps: [
            "Buka menu AI Analyst dari sidebar.",
            "Upload gambar yang jelas atau gunakan kamera.",
            "Tinjau hasil kategori, confidence, dan rekomendasi pemilahan.",
          ],
        },
        {
          title: "Cara mengerjakan Quiz",
          description: "Latih pemahaman pemilahan lewat modul quiz interaktif.",
          steps: [
            "Buka menu Quiz dan pilih modul yang tersedia.",
            "Jawab pertanyaan satu per satu.",
            "Lihat ringkasan hasil dan ulangi modul untuk memperbaiki akurasi.",
          ],
        },
        {
          title: "Cara mendapatkan poin dan badge",
          description: "Poin dan badge diberikan dari aktivitas positif di aplikasi.",
          steps: [
            "Upload gambar sampah untuk klasifikasi.",
            "Selesaikan quiz dan jawab pertanyaan dengan benar.",
            "Pantau badge baru di dashboard setelah target tercapai.",
          ],
        },
        {
          title: "Cara meningkatkan level akun",
          description: "Level naik seiring bertambahnya poin dan konsistensi aktivitas.",
          steps: [
            "Gunakan fitur AI dan Quiz secara rutin.",
            "Kejar tantangan harian atau mingguan di dashboard.",
            "Lihat progres level pada ringkasan profil dashboard.",
          ],
        },
      ],
    },
    faq: {
      title: "Pertanyaan yang Sering Diajukan",
      description: "Jawaban cepat untuk kendala umum saat memakai PilahYuk.",
      items: [
        {
          question: "Mengapa hasil AI berbeda?",
          answer:
            "Model membaca pola visual dari gambar. Pencahayaan, sudut foto, objek yang tertutup, atau sampah yang tercampur bisa membuat hasil berbeda.",
        },
        {
          question: "Bagaimana cara upload gambar?",
          answer:
            "Masuk ke AI Analyst, pilih tombol upload atau kamera, lalu gunakan gambar dengan objek sampah yang terlihat jelas di tengah frame.",
        },
        {
          question: "Bagaimana sistem poin bekerja?",
          answer:
            "Poin dikumpulkan dari aktivitas seperti analisis sampah dan quiz. Aktivitas yang valid akan dihitung ke total poin akun.",
        },
        {
          question: "Bagaimana cara mendapatkan badge?",
          answer:
            "Badge terbuka setelah kamu mencapai target tertentu, misalnya jumlah upload, streak aktivitas, atau capaian poin.",
        },
      ],
    },
    contact: {
      email: "CC26-PSU182@student.devacademy.id",
      githubUrl: "https://github.com/DBSDicoding2026-UNTIRTA/FullstackAPIECO",
      teamTitle: "Tim Pengembang",
      teamDescription: "Capstone team PilahYuk untuk fullstack, AI, dan Data Scientist.",
      responseTime: "Estimasi respons: 1-2 hari kerja",
      members: supportMembers,
    },
    report: {
      title: "Laporkan Masalah",
      description:
        "Ceritakan kendala yang kamu alami. Laporan akan masuk ke dashboard admin sebagai support ticket.",
      titleLabel: "Judul masalah",
      titlePlaceholder: "Contoh: Hasil AI tidak muncul setelah upload",
      descriptionLabel: "Deskripsi masalah",
      descriptionPlaceholder:
        "Tuliskan langkah yang kamu lakukan, halaman yang dibuka, dan pesan error jika ada.",
      submit: "Kirim",
      submitting: "Mengirim...",
      successTitle: "Laporan berhasil dikirim",
      successDescription: "Terima kasih. Tim admin akan meninjau laporan kamu.",
      emptyTitle: "Belum ada laporan dikirim",
      emptyDescription: "Isi judul dan deskripsi masalah untuk membuat laporan baru.",
    },
  },
  en: {
    panelTitle: "Need Help?",
    panelDescription:
      "Find quick guides, FAQ answers, team contacts, and issue reporting for PilahYuk.",
    tabs: {
      guide: "Guide",
      faq: "FAQ",
      contact: "Contact",
      report: "Report",
    },
    guide: {
      title: "Usage Guide",
      description: "Short flows for the core features people use most.",
      items: [
        {
          title: "How to use AI Scanner",
          description: "Use AI Analyst to identify waste categories from an image.",
          steps: [
            "Open AI Analyst from the sidebar.",
            "Upload a clear image or use the camera.",
            "Review the category, confidence score, and sorting recommendation.",
          ],
        },
        {
          title: "How to take a Quiz",
          description: "Practice sorting knowledge through interactive quiz modules.",
          steps: [
            "Open Quiz and choose an available module.",
            "Answer each question one by one.",
            "Review your result summary and retry modules to improve accuracy.",
          ],
        },
        {
          title: "How to earn points and badges",
          description: "Points and badges come from positive actions in the app.",
          steps: [
            "Upload waste images for classification.",
            "Complete quizzes and answer correctly.",
            "Check your dashboard for newly unlocked badges.",
          ],
        },
        {
          title: "How to level up your account",
          description: "Your level increases as points and consistent activity grow.",
          steps: [
            "Use the AI and Quiz features regularly.",
            "Complete daily or weekly dashboard challenges.",
            "Track level progress from the dashboard profile summary.",
          ],
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      description: "Fast answers for common PilahYuk issues.",
      items: [
        {
          question: "Why can AI results differ?",
          answer:
            "The model reads visual patterns from images. Lighting, angle, covered objects, or mixed waste can change the result.",
        },
        {
          question: "How do I upload an image?",
          answer:
            "Go to AI Analyst, choose upload or camera, then use an image where the waste object is clearly visible in the frame.",
        },
        {
          question: "How does the point system work?",
          answer:
            "Points are collected from activities such as waste analysis and quizzes. Valid activities count toward your account total.",
        },
        {
          question: "How do I earn badges?",
          answer:
            "Badges unlock after you reach specific targets, such as upload count, activity streaks, or point milestones.",
        },
      ],
    },
    contact: {
      email: "CC26-PSU182@student.devacademy.id",
      githubUrl: "https://github.com/DBSDicoding2026-UNTIRTA/FullstackAPIECO",
      teamTitle: "Development Team",
      teamDescription: "PilahYuk capstone team for fullstack, AI, and machine learning.",
      responseTime: "Estimated response: 1-2 business days",
      members: supportMembers,
    },
    report: {
      title: "Report an Issue",
      description:
        "Tell us what went wrong. Your report will appear in the admin dashboard as a support ticket.",
      titleLabel: "Issue title",
      titlePlaceholder: "Example: AI result does not appear after upload",
      descriptionLabel: "Issue description",
      descriptionPlaceholder:
        "Write the steps you took, the page you opened, and any error message you saw.",
      submit: "Send",
      submitting: "Sending...",
      successTitle: "Report sent successfully",
      successDescription: "Thank you. The admin team will review your report.",
      emptyTitle: "No report submitted yet",
      emptyDescription: "Fill in the issue title and description to create a new report.",
    },
  },
};
