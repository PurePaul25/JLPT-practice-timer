export interface JLPTSection {
  id: string;
  nameVi: string;
  nameEn: string;
  duration: number; // Duration in seconds
  isBreak: boolean;
}

export interface JLPTLevelConfig {
  id: string;
  name: string;
  badgeColor: string;
  textColor: string;
  sections: JLPTSection[];
}
export const JLPT_LEVELS: JLPTLevelConfig[] = [
  {
    id: 'N5',
    name: 'N5',
    badgeColor: 'from-emerald-400 to-green-600',
    textColor: 'text-emerald-500',
    sections: [
      { id: 'vocabulary', nameVi: 'Từ vựng', nameEn: 'Vocabulary', duration: 20 * 60, isBreak: false },
      { id: 'break-1', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'grammar-reading', nameVi: 'Ngữ pháp & Đọc hiểu', nameEn: 'Grammar & Reading', duration: 40 * 60, isBreak: false },
      { id: 'break-2', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'listening', nameVi: 'Nghe hiểu', nameEn: 'Listening', duration: 30 * 60, isBreak: false },
    ],
  },
  {
    id: 'N4',
    name: 'N4',
    badgeColor: 'from-sky-400 to-blue-600',
    textColor: 'text-blue-500',
    sections: [
      { id: 'vocabulary', nameVi: 'Từ vựng', nameEn: 'Vocabulary', duration: 25 * 60, isBreak: false },
      { id: 'break-1', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'grammar-reading', nameVi: 'Ngữ pháp & Đọc hiểu', nameEn: 'Grammar & Reading', duration: 55 * 60, isBreak: false },
      { id: 'break-2', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'listening', nameVi: 'Nghe hiểu', nameEn: 'Listening', duration: 35 * 60, isBreak: false },
    ],
  },
  {
    id: 'N3',
    name: 'N3',
    badgeColor: 'from-violet-400 to-purple-600',
    textColor: 'text-purple-500',
    sections: [
      { id: 'vocabulary', nameVi: 'Từ vựng - Chữ Hán', nameEn: 'Vocabulary - Kanji', duration: 30 * 60, isBreak: false },
      { id: 'break-1', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'grammar-reading', nameVi: 'Ngữ pháp & Đọc hiểu', nameEn: 'Grammar & Reading', duration: 70 * 60, isBreak: false },
      { id: 'break-2', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'listening', nameVi: 'Nghe hiểu', nameEn: 'Listening', duration: 40 * 60, isBreak: false },
    ],
  },
  {
    id: 'N2',
    name: 'N2',
    badgeColor: 'from-orange-400 to-amber-600',
    textColor: 'text-amber-500',
    sections: [
      { id: 'language-reading', nameVi: 'Kiến thức ngôn ngữ & Đọc hiểu', nameEn: 'Language Knowledge & Reading', duration: 105 * 60, isBreak: false },
      { id: 'break-1', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'listening', nameVi: 'Nghe hiểu', nameEn: 'Listening', duration: 50 * 60, isBreak: false },
    ],
  },
  {
    id: 'N1',
    name: 'N1',
    badgeColor: 'from-rose-400 to-red-600',
    textColor: 'text-rose-500',
    sections: [
      { id: 'language-reading', nameVi: 'Kiến thức ngôn ngữ & Đọc hiểu', nameEn: 'Language Knowledge & Reading', duration: 110 * 60, isBreak: false },
      { id: 'break-1', nameVi: 'Nghỉ giải lao', nameEn: 'Break', duration: 5 * 60, isBreak: true },
      { id: 'listening', nameVi: 'Nghe hiểu', nameEn: 'Listening', duration: 60 * 60, isBreak: false },
    ],
  },
];
