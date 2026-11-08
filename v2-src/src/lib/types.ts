export type QType = 'mc' | 'gap' | 'order' | 'fix';

interface QBase {
  id: string;
  type: QType;
  instruction: string;
  explanation: string;
}

export interface MCOption {
  id: string;
  text: string;
  why: string;
}

export interface MCQuestion extends QBase {
  type: 'mc';
  sentence: string;
  options: MCOption[];
  answer: string;
}

export interface GapQuestion extends QBase {
  type: 'gap';
  /** Kalimat dengan penanda {{1}}, {{2}}, ... */
  sentence: string;
  blanks: { accept: string[]; hint?: string }[];
}

export interface OrderQuestion extends QBase {
  type: 'order';
  /** Arti bahasa Indonesia, supaya urutan yang dimaksud jelas */
  hint?: string;
  tokens: string[];
  accept: string[][];
}

export interface FixQuestion extends QBase {
  type: 'fix';
  segments: string[];
  errorIndex: number;
  accept: string[];
  corrected: string;
}

export type Question = MCQuestion | GapQuestion | OrderQuestion | FixQuestion;

export interface Lesson {
  /** Paragraf dipisah baris kosong. *teks* = kata bahasa Inggris. */
  summary: string;
  patterns: { formula: string; example: string }[];
  examples: { en: string; id: string }[];
  commonMistakes: { wrong: string; right: string; why: string }[];
}

export interface Unit {
  schemaVersion: 1;
  no: number;
  groupId: string;
  title: string;
  lesson: Lesson;
  questions: Question[];
}

export interface CatalogUnit {
  no: number;
  groupId: string;
  title: string;
  keywords: string[];
  released: boolean;
  questionCount: number;
  pack?: string;
}

export interface Group {
  id: string;
  title: string;
  unitRange: [number, number];
  pack: string;
}

export interface Catalog {
  schemaVersion: 1;
  contentVersion: string;
  book: { title: string; edition: number; year: number; units: number };
  groups: Group[];
  units: CatalogUnit[];
}

export type UnitStatus = 'new' | 'learning' | 'done';

export interface UnitProgress {
  unitNo: number;
  status: UnitStatus;
  lastScore: number | null;
  bestScore: number | null;
  sessions: number;
  completedAt: string | null;
  lastOpenedAt: string | null;
}

export type Mode = 'practice' | 'review';

export interface Attempt {
  id?: number;
  questionId: string;
  unitNo: number;
  mode: Mode;
  correct: boolean;
  response: unknown;
  localDate: string;
  answeredAt: string;
  sessionId: string;
}

export interface ReviewItem {
  questionId: string;
  unitNo: number;
  box: number;
  dueDate: string;
  lapses: number;
  addedAt: string;
  lastReviewedAt: string | null;
}

export interface DailyActivity {
  localDate: string;
  answers: number;
  correct: number;
}

export interface MetaRow {
  key: string;
  value: unknown;
}
