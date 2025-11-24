// src/types/apqm.ts
export type BookCategory =
  | "A_TOP_PUBLISHER"         // 30 bal
  | "B_WOS_SCOPUS_BOOK_SERIES" // 15 bal
  | "C_HIGH_RATED_LOCAL"       // 5 bal
  | "D_CHAPTER_INTL"           // 10 bal
  | "D_CHAPTER_LOCAL";         // 5 bal

export type ArticleCategory =
  | "A_WOS_AHCI_SCI_SSCI" // 20 bal
  | "B_SCOPUS"            // 15 bal
  | "C_WOS_ESCI"          // 15 bal
  | "D_WOS_CPCI_FULL"     // 15 bal
  | "D_WOS_CPCI_ABSTRACT" // 5 bal
  | "E_OTHER_INDEXED"     // 7 bal
  | "F_AAK_JOURNAL";      // 5 bal

export interface BookEntry {
  id: string;
  title: string;
  publisher: string;     // Nəşriyyat adı
  category: BookCategory; // seçilən kateqoriya
  year: number;
  points: number;         // kateqoriyadan gələn bal
}

export interface ArticleEntry {
  id: string;
  title: string;
  journal: string;
  category: ArticleCategory;
  year: number;
  authorCount: number;
  basePoints: number;       // kateqoriyaya görə
  authorCoefficient: number; // müəllif sayına görə
  points: number;            // basePoints * authorCoefficient
}

export interface PersonalInfo {
  university: string;
  fullName: string;
  email: string;
  gender: "qadin" | "kisi" | "other";
  employmentType: "yarim" | "tam" | "saat";
  degree: "doktor" | "phd" | "magistr";
  position: "dosent" | "dosent_phd" | "professor" | "professor_phd";
  department: string;
  faculty: string;
  researchCenter: string;
  academicYear: string;
}

export interface ApqmSubmission {
  personalInfo: PersonalInfo;
  books: BookEntry[];
  articles: ArticleEntry[];

  totalBookPoints: number;
  totalArticlePoints: number;
  grandTotalPoints: number;

  createdAt: string; // ISO
}

export interface ApqmFormValues {
  personalInfo: PersonalInfo;
  books: BookEntry[];
  articles: ArticleEntry[];
}