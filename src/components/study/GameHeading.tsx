'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/accessibility/language';
const names: Record<string, string> = {
  fractions: 'भिन्न बनाऔँ र तुलना गरौँ',
  balance: 'तराजु सन्तुलनमा राखौँ',
  circuits: 'विद्युत् परिपथ पूरा गरौँ',
  budget: 'सानो बजेट बनाऔँ',
  'digital-safety': 'असुरक्षित सन्देश चिनौँ',
  waste: 'फोहोरलाई सही ठाउँमा राखौँ',
  reading: 'कथा पढेर बुझौँ',
  'study-habits': 'व्यावहारिक अध्ययन योजना बनाऔँ',
};
export function GameHeading({
  id,
  title,
  subject,
  ages,
  summary,
  simulation,
}: {
  id: string;
  title: string;
  subject: string;
  ages: string;
  summary: string;
  simulation: boolean;
}) {
  const { language } = useLanguage();
  return (
    <div lang={language}>
      <Link href="/play" prefetch={false}>
        {language === 'ne' ? 'सबै खेल र सिकाइ गतिविधि' : 'All Play and Learn activities'}
      </Link>
      <div className="eyebrow">
        {subject} · {ages}
      </div>
      <h1 className="detail-title">{language === 'ne' ? names[id] || title : title}</h1>
      {simulation && (
        <p className="large-copy">
          {language === 'ne'
            ? 'तलको भर्चुअल खेलमा खोज्नुहोस्। बाहिरी खेलको भाषा त्यसको प्रदायकले निर्धारण गर्छ।'
            : summary}
        </p>
      )}
    </div>
  );
}
