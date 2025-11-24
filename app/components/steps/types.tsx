// src/components/steps/types.ts



export type BookCategory =
  | "A_TOP_PUBLISHER" // 30 bal
  | "B_WOS_SCOPUS_BOOK_SERIES" // 15 bal
  | "C_HIGH_RATED_LOCAL" // 5 bal
  | "D_CHAPTER_INTL" // 10 bal
  | "D_CHAPTER_LOCAL"; // 5 bal;

  export type ArticleQuartile = "Q1" | "Q2" | "Q3" | "Q4";


export type ArticleCategory =
  | "A_WOS_AHCI_SCI_SSCI" // 20 bal
  | "B_SCOPUS" // 15 bal
  | "C_WOS_ESCI" // 15 bal
  | "D_WOS_CPCI_FULL" // 15 bal
  | "D_WOS_CPCI_ABSTRACT" // 5 bal
  | "E_OTHER_INDEXED" // 7 bal
  | "F_AAK_JOURNAL"; // 5 bal;

// III. Layihə
export type ProjectScope = "international" | "local";
export type ProjectType = "INTERNATIONAL" | "LOCAL";
export type ProjectRole = "CHAIR" | "EXECUTOR" | "COORDINATOR";

export interface ProjectEntry {
  id: string;
  title: string;
  organization: string;      // layihəni verən qurum
  type: ProjectType;         // Beynəlxalq / Yerli
  role: ProjectRole;         // Sədr / İcraçı / Koordinator
  year: number;
  points: number;            // cədvələ uyğun bal
}

// IV. Konfrans / kongres / simpozium
// types.ts

export type ConferenceScope =
  | "WOS_SCOPUS"          // WOS / Scopus indeksli
  | "OTHER_INTERNATIONAL" // Digər beynəlxalq
  

export type ConferenceRole =
  | "CHAIR"          // Sədr / həmsədr
  | "KEYNOTE"        // Əsas məruzəçi
  | "SECTION_CHAIR"  // Bölmə sədri
  | "SPEAKER"        // Məruzəçi
  | "ORG_COMMITTEE"  // Təşkilat komitəsi
  | "PARTICIPANT"    // İştirakçı
  | "MODERATOR";     // Moderator

export interface ConferenceEntry {
  id: string;
  name: string;
  place: string;
  year: number;
  scope: ConferenceScope;
  role: ConferenceRole;
  basePoints: number;
  points: number;
}

export interface ApqmFormValues {
  // ... sənin digər field-lərin ...
  conferences: ConferenceEntry[];
}
// V. Seminar / panel / sosial xidmət
export type SeminarCategory =
  | "speaker"
  | "participant"
  | "moderator"
  | "oyu_internal_speaker"
  | "oyu_internal_participant";

export interface SeminarEntry {
  id: string;
  title: string;
  category: SeminarCategory;
  year?: number;
  points?: number;
}

// VI. Tərcümə
export type TranslationType = "book" | "chapter";

export interface TranslationEntry {
  id: string;
  title: string;
  type: TranslationType;
  year?: number;
  points?: number;
}

// VII. Redaktorluq / rəyçilik
export type EditorialType =
  | "editor_wos_scopus"
  | "editor_other_international"
  | "editor_local"
  | "reviewer_wos_scopus"
  | "reviewer_other_international"
  | "reviewer_local"
  | "reviewer_textbook"
  | "reviewer_oyu_journal"
  | "reviewer_phd";

export interface EditorialReviewEntry {
  id: string;
  title: string;
  type: EditorialType;
  year?: number;
  points?: number;
}

// VIII. Mükafat / təltif
export type AwardCategory =
  | "best_paper"
  | "training_certificate_international"
  | "training_certificate_local"
  | "best_article_local"
  | "outstanding_researcher"
  | "oyu_excellence";

export interface AwardEntry {
  id: string;
  title: string;
  category: AwardCategory;
  year?: number;
  points?: number;
}

// src/types/apqm.ts (və ya səndə haradadırsa)
export interface BookEntry {
  id: string;
  title: string;
  publisher: string;
  category: BookCategory;
  year: number;
  authorCount: number;        
  basePoints: number;        
  authorCoefficient: number;  
  points: number;             
}

export interface ArticleEntry {
  id: string;
  title: string;
  journal: string;
  category: ArticleCategory;
  quartile?: ArticleQuartile; 
  year: number;
  authorCount: number;
  basePoints: number; // kateqoriyaya görə
  authorCoefficient: number; // müəllif sayına görə
  points: number; // basePoints * authorCoefficient
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
  academicYear: string; // məsələn: 2024-2025
  fin: string;          // 🔹 YENİ
}

// Form üçün istifadə edəcəyimiz əsas type
export interface ApqmFormValues {
  personalInfo: PersonalInfo;
  books: BookEntry[];
  articles: ArticleEntry[];
  projects: ProjectEntry[];
  conferences: ConferenceEntry[];
  seminars: SeminarEntry[];
  translations: TranslationEntry[];
  editorialReviews: EditorialReviewEntry[];
  awards: AwardEntry[];
}

// Firestore-a yazacağın submission tipi (admin üçün)
export interface ApqmSubmission extends ApqmFormValues {
  totalBookPoints: number;
  totalArticlePoints: number;
  grandTotalPoints: number;
  createdAt: string; // ISO
}


// IX. DİSSERTASİYA
export type DissertationCategory =
  | "PHD_SUPERVISION"            // PhD rəhbərlik (10)
  | "DEFENDED_PHD"              // PhD müdafiə edib (10)
  | "DEFENDED_DOCTORAL"         // Elmlər doktoru müdafiə (20)
  | "ACADEMIC_TITLE_DOCENT"     // Dosent elmi adı (8)
  | "ACADEMIC_TITLE_PROFESSOR"  // Professor elmi adı (10)
  | "MASTER_SUPERVISION";       // Magistr rəhbərlik (2);

export interface DissertationEntry {
  id: string;
  title: string;      // dissertasiya mövzusu və ya tələbə adı
  category: DissertationCategory;
  year: number;
  points: number;
}

// X. Elmi şuralar və təşkilatlar
export type AcademicBodyCategory =
  | "AAK_COUNCIL_CHAIR"          // 10
  | "AAK_COUNCIL_MEMBER"        // 5
  | "SEMINAR_CHAIR"             // 6
  | "SEMINAR_MEMBER"            // 3
  | "BACHELOR_COMMISSION"       // 3
  | "MASTER_COMMISSION_CHAIR"   // 3
  | "MASTER_COMMISSION_MEMBER"  // 2
  | "PHD_DEFENSE_CHAIR"         // 4
  | "PHD_DEFENSE_MEMBER";       // 3

export interface AcademicBodyEntry {
  id: string;
  title: string;        // şura/təşkilatın adı
  category: AcademicBodyCategory;
  year: number;
  points: number;
}

// XI. Jüri
export type JuryCategory =
  | "INTL_CHAIR"       // 8
  | "LOCAL_CHAIR"      // 5
  | "INTL_MEMBER"      // 5
  | "LOCAL_MEMBER";    // 3

export interface JuryEntry {
  id: string;
  eventName: string;
  category: JuryCategory;
  year: number;
  points: number;
}

// XII. Patent / yeni məhsul
export type PatentCategory =
  | "PATENT"                    // 20
  | "INTERNATIONAL_IMPLEMENT"   // 15
  | "LOCAL_IMPLEMENT";          // 10

export interface PatentEntry {
  id: string;
  title: string;
  category: PatentCategory;
  year: number;
  points: number;
}

// XIII. OYU-nu təmsil etmə
export type RepresentationScope = "INTERNATIONAL" | "LOCAL";

export interface RepresentationEntry {
  id: string;
  organization: string;
  scope: RepresentationScope;
  year: number;
  points: number;
}

// XIV. Akademik və idarəetmə vəzifələri
export type AcademicPositionCategory =
  | "PRORECTOR"          // 10
  | "DEAN"               // 8
  | "CHAIR_HEAD"         // 8
  | "RESEARCH_CENTER_HEAD" // 8
  | "COORDINATOR"        // 5
  | "DEPARTMENT_HEAD";   // 6

export interface AcademicPositionEntry {
  id: string;
  position: AcademicPositionCategory;
  unitName: string; // fakültə/kafedra
  year: number;
  points: number;
}

// XVII. Sənətşünaslıq fəaliyyəti
export type ArtsActivityCategory =
  | "INTL_SOLO"     // 10
  | "INTL_GROUP"    // 8
  | "LOCAL_SOLO"    // 5
  | "LOCAL_GROUP";  // 3

export interface ArtsActivityEntry {
  id: string;
  title: string;
  category: ArtsActivityCategory;
  year: number;
  points: number;
}

// XIX. Sənətşünaslıq mükafatı
export type ArtsAwardScope = "INTERNATIONAL" | "LOCAL";

export interface ArtsAwardEntry {
  id: string;
  title: string;
  scope: ArtsAwardScope;
  year: number;
  points: number;
}

// XX. Açıq suallar
export interface OpenResponses {
  satisfaction: string;   // A
  biggestAchievement: string; // B
  nextYearPriorities: string; // C
}

// ApqmFormValues içində əlavə et:
export interface ApqmFormValues {
  personalInfo: PersonalInfo;
  books: BookEntry[];
  articles: ArticleEntry[];
  projects: ProjectEntry[];
  conferences: ConferenceEntry[];
  seminars: SeminarEntry[];
  translations: TranslationEntry[];
  editorialReviews: EditorialReviewEntry[];
  awards: AwardEntry[];

  dissertations: DissertationEntry[];
  academicBodies: AcademicBodyEntry[];
  juries: JuryEntry[];
  patents: PatentEntry[];
  representations: RepresentationEntry[];
  academicPositions: AcademicPositionEntry[];
  artsActivities: ArtsActivityEntry[];
  artsAwards: ArtsAwardEntry[];
  openResponses: OpenResponses;
}