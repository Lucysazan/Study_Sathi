import catalog from '@/data/school-library.json';

export const schoolLibrary = catalog;
export type SchoolBook = (typeof catalog.books)[number];
export type SchoolPlaylist = (typeof catalog.playlists)[number];
export const subjectLabels: Record<string, { name: string; nepali: string; icon: string }> = {
  physics: { name: 'Physics', nepali: 'भौतिक विज्ञान', icon: 'science' },
  chemistry: { name: 'Chemistry', nepali: 'रसायन विज्ञान', icon: 'science' },
  biology: { name: 'Biology', nepali: 'जीव विज्ञान', icon: 'science' },
  'computer-science': { name: 'Computer Science', nepali: 'कम्प्युटर विज्ञान', icon: 'science' },
  accounting: {
    name: 'Accounting and Office Practice',
    nepali: 'लेखा तथा कार्यालय सञ्चालन',
    icon: 'math',
  },
  'business-studies': { name: 'Business Studies', nepali: 'व्यवसाय अध्ययन', icon: 'book' },
  economics: { name: 'Economics', nepali: 'अर्थशास्त्र', icon: 'globe' },
  'population-studies': { name: 'Population Studies', nepali: 'जनसङ्ख्या शिक्षा', icon: 'globe' },
  education: { name: 'Education', nepali: 'शिक्षा', icon: 'book' },
  yoga: { name: 'Yoga Education', nepali: 'योग शिक्षा', icon: 'health' },
  ayurveda: { name: 'Ayurveda Education', nepali: 'आयुर्वेद शिक्षा', icon: 'health' },
  mathematics: { name: 'Mathematics', nepali: 'गणित', icon: 'math' },
  science: { name: 'Science and Technology', nepali: 'विज्ञान तथा प्रविधि', icon: 'science' },
  english: { name: 'English', nepali: 'अङ्ग्रेजी', icon: 'english' },
  nepali: { name: 'Nepali', nepali: 'नेपाली', icon: 'book' },
  'social-studies': { name: 'Social Studies', nepali: 'सामाजिक अध्ययन', icon: 'globe' },
  health: {
    name: 'Health, Physical and Creative Arts',
    nepali: 'स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला',
    icon: 'health',
  },
  'our-surroundings': { name: 'Our Surroundings', nepali: 'हाम्रो सेरोफेरो', icon: 'globe' },
  history: { name: 'History', nepali: 'इतिहास', icon: 'book' },
  geography: { name: 'Geography', nepali: 'भूगोल', icon: 'globe' },
  environment: { name: 'Environmental Science', nepali: 'वातावरण विज्ञान', icon: 'science' },
  civics: { name: 'Civics', nepali: 'नागरिक शास्त्र', icon: 'globe' },
  'local-languages': { name: 'Local Languages', nepali: 'मातृभाषा', icon: 'book' },
};
export const schoolGrades = Array.from({ length: 12 }, (_, index) => index + 1);
export function parseSchoolGrade(value: string) {
  return /^(?:[1-9]|1[0-2])$/.test(value) ? Number(value) : null;
}
export function gradeSubjects(grade: number) {
  const ids = new Set(
    [...catalog.books, ...catalog.playlists]
      .filter((item) => item.grade === grade)
      .map((item) => item.subject),
  );
  return Object.entries(subjectLabels)
    .filter(([id]) => ids.has(id))
    .map(([id, meta]) => ({ id, ...meta }));
}
export function subjectMaterials(grade: number, subject: string) {
  return {
    books: catalog.books.filter((item) => item.grade === grade && item.subject === subject),
    playlists: catalog.playlists.filter((item) => item.grade === grade && item.subject === subject),
  };
}
export function subjectPath(grade: number, subject: string) {
  return `/study/${grade}/${encodeURIComponent(subject)}`;
}
export function bookPath(book: SchoolBook) {
  return `${subjectPath(book.grade, book.subject)}/read/${book.id}`;
}
export function playlistPath(playlist: SchoolPlaylist) {
  return `${subjectPath(playlist.grade, playlist.subject)}/watch/${playlist.id}`;
}
export function officialPdfUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      ['giwmscdnone.gov.np', 'giwmscdntwo.gov.np', 'moecdc.gov.np', 'www.moecdc.gov.np'].includes(
        url.hostname,
      ) &&
      url.pathname.toLowerCase().endsWith('.pdf')
    );
  } catch {
    return false;
  }
}
