// src/lib/scoring.ts
import { ArticleCategory, ArticleEntry, BookCategory, BookEntry } from "../types/apqm";

// müəllif sayı əmsalı
export function getAuthorCoefficient(authorCount: number): number {
  if (authorCount <= 1) return 1;
  if (authorCount === 2) return 0.6;
  if (authorCount === 3) return 0.4;
  return 0.2; // 4 və daha çox
}

// məqalə kateqoriyasına görə baza bal
export function getArticleBasePoints(category: ArticleCategory): number {
  switch (category) {
    case "A_WOS_AHCI_SCI_SSCI":
      return 20;
    case "B_SCOPUS":
      return 15;
    case "C_WOS_ESCI":
      return 15;
    case "D_WOS_CPCI_FULL":
      return 15;
    case "D_WOS_CPCI_ABSTRACT":
      return 5;
    case "E_OTHER_INDEXED":
      return 7;
    case "F_AAK_JOURNAL":
      return 5;
    default:
      return 0;
  }
}

// kitab kateqoriyasına görə bal
export function getBookPoints(category: BookCategory): number {
  switch (category) {
    case "A_TOP_PUBLISHER":
      return 30;
    case "B_WOS_SCOPUS_BOOK_SERIES":
      return 15;
    case "C_HIGH_RATED_LOCAL":
      return 5;
    case "D_CHAPTER_INTL":
      return 10;
    case "D_CHAPTER_LOCAL":
      return 5;
    default:
      return 0;
  }
}

// məqalə üçün yekun bal hesablayır
export function computeArticlePoints(entry: Omit<ArticleEntry, "points" | "basePoints" | "authorCoefficient">): ArticleEntry {
  const basePoints = getArticleBasePoints(entry.category);
  const authorCoefficient = getAuthorCoefficient(entry.authorCount);
  const points = basePoints * authorCoefficient;

  return {
    ...entry,
    basePoints,
    authorCoefficient,
    points,
  };
}

// kitab üçün yekun obyekt
export function computeBookPoints(entry: Omit<BookEntry, "points">): BookEntry {
  const points = getBookPoints(entry.category);
  return {
    ...entry,
    points,
  };
}