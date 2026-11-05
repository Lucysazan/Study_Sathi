export type MissionLanguage = 'en' | 'ne';
type Text = Record<MissionLanguage, string>;
type Scenario = {
  id: string;
  title: Text;
  message: Text;
  options: { id: string; text: Text }[];
  safeChoice: string;
  explanation: Text;
  clue: Text;
};

export const safetyScenarios: readonly Scenario[] = [
  {
    id: 'otp',
    title: { en: 'A wallet verification message', ne: 'वालेट प्रमाणित गर्ने सन्देश' },
    message: {
      en: '“Your digital wallet will close in 10 minutes! Reply with the OTP sent to your phone to keep it open.” The sender is a number you do not know.',
      ne: '“तपाईंको डिजिटल वालेट १० मिनेटमा बन्द हुन्छ! खुला राख्न फोनमा आएको OTP पठाउनुहोस्।” पठाउने नम्बर तपाईंले चिन्नुहुन्न।',
    },
    options: [
      {
        id: 'share',
        text: { en: 'Reply with the OTP before time runs out.', ne: 'समय सकिनुअघि OTP पठाउने।' },
      },
      {
        id: 'check',
        text: {
          en: 'Keep the OTP private. Ask a trusted adult and check through the official app.',
          ne: 'OTP गोप्य राख्ने। विश्वासिलो वयस्कलाई सोध्ने र आधिकारिक एपबाट जाँच गर्ने।',
        },
      },
      {
        id: 'ask',
        text: {
          en: 'Ask the sender whether they really work for the wallet company.',
          ne: 'वालेट कम्पनीमै काम गर्छन् कि भनेर त्यही व्यक्तिलाई सोध्ने।',
        },
      },
    ],
    safeChoice: 'check',
    clue: {
      en: 'A countdown and a request for a secret code.',
      ne: 'हतार गराउने समयसीमा र गोप्य कोडको माग।',
    },
    explanation: {
      en: 'Keep OTPs, PINs and passwords private. A stranger saying “I work for support” is not proof. Check using an official app or a contact you already trust, with help from a trusted adult.',
      ne: 'OTP, पिन र पासवर्ड गोप्य राख्नुहोस्। अपरिचित व्यक्तिले “म सहयोग केन्द्रमा काम गर्छु” भन्दैमा विश्वास नगर्नुहोस्। विश्वासिलो वयस्कको सहयोगमा आधिकारिक एप वा पहिलेबाट चिनेको सम्पर्कबाट जाँच गर्नुहोस्।',
    },
  },
  {
    id: 'prize',
    title: { en: 'You won a school bag!', ne: 'तपाईंले स्कुल ब्याग जित्नुभयो!' },
    message: {
      en: '“Congratulations! You won a school bag worth NPR 5,000. Send NPR 200 to this personal wallet today to claim it.” You did not enter a competition.',
      ne: '“बधाई छ! तपाईंले रु. ५,००० को स्कुल ब्याग जित्नुभयो। लिन आजै यो व्यक्तिगत वालेटमा रु. २०० पठाउनुहोस्।” तपाईंले कुनै प्रतियोगितामा भाग लिनुभएको थिएन।',
    },
    options: [
      {
        id: 'pay',
        text: {
          en: 'Send the fee because it is much smaller than the prize.',
          ne: 'पुरस्कारभन्दा शुल्क कम भएकाले पैसा पठाउने।',
        },
      },
      {
        id: 'forward',
        text: {
          en: 'Forward the offer so friends can claim a prize too.',
          ne: 'साथीहरूले पनि पुरस्कार पाऊन् भनेर सन्देश पठाउने।',
        },
      },
      {
        id: 'pause',
        text: {
          en: 'Do not pay or forward it. Show a trusted adult and verify independently.',
          ne: 'पैसा नपठाउने र सन्देश नफैलाउने। विश्वासिलो वयस्कलाई देखाएर छुट्टै माध्यमबाट जाँच गर्ने।',
        },
      },
    ],
    safeChoice: 'pause',
    clue: {
      en: 'An unexpected prize, an upfront fee and pressure to act today.',
      ne: 'नसोचेको पुरस्कार, पहिले नै शुल्क र आजै गर्नुपर्ने दबाब।',
    },
    explanation: {
      en: 'Pause when an unexpected offer asks for money or private details. A small fee does not make an offer trustworthy. Verify through a known official contact, rather than the contact supplied in the message.',
      ne: 'नसोचेको प्रस्तावले पैसा वा निजी विवरण मागेमा रोकिनुहोस्। शुल्क थोरै हुँदैमा प्रस्ताव विश्वासिलो हुँदैन। सन्देशमा दिइएको सम्पर्कभन्दा पहिलेबाट चिनेको आधिकारिक सम्पर्कबाट जाँच गर्नुहोस्।',
    },
  },
  {
    id: 'school',
    title: { en: 'A familiar classroom reminder', ne: 'चिनेको कक्षाको सम्झना' },
    message: {
      en: 'In your usual class group, your teacher posts: “For tomorrow, read page 12 of your science book. Ask me in class if you have a question.” There is no link, fee or request for private information.',
      ne: 'सधैँ प्रयोग गर्ने कक्षाको समूहमा शिक्षकले लेख्नुभयो: “भोलिका लागि विज्ञान किताबको पृष्ठ १२ पढ्नुहोस्। प्रश्न भए कक्षामा सोध्नुहोस्।” यसमा लिंक, शुल्क वा निजी विवरणको माग छैन।',
    },
    options: [
      {
        id: 'read',
        text: {
          en: 'Read the page. If unsure, ask the teacher through the usual class channel.',
          ne: 'पृष्ठ पढ्ने। शङ्का भए सधैँको कक्षाको माध्यमबाट शिक्षकलाई सोध्ने।',
        },
      },
      {
        id: 'password',
        text: {
          en: 'Send your password to prove that you received the message.',
          ne: 'सन्देश पाएको प्रमाण दिन पासवर्ड पठाउने।',
        },
      },
      {
        id: 'panic',
        text: {
          en: 'Assume every online message is a scam and stop using learning resources.',
          ne: 'हरेक अनलाइन सन्देश ठगी हो भनेर सबै सिकाइ सामग्री प्रयोग गर्न छोड्ने।',
        },
      },
    ],
    safeChoice: 'read',
    clue: {
      en: 'A familiar context and an ordinary task, without a secret or payment request.',
      ne: 'चिनेको सन्दर्भ र सामान्य काम, गोप्य जानकारी वा पैसाको माग छैन।',
    },
    explanation: {
      en: 'Check the context and what you are being asked to do. This message asks for ordinary schoolwork. You can clarify it through your usual teacher contact without sharing any password or code.',
      ne: 'सन्दर्भ र गर्न भनिएको काम जाँच गर्नुहोस्। यस सन्देशले सामान्य गृहकार्य गर्न भनेको छ। पासवर्ड वा कोड नदिई सधैँको शिक्षक सम्पर्कबाट स्पष्ट पार्न सक्नुहुन्छ।',
    },
  },
];

export const missionCopy = {
  en: {
    title: 'Spot the Scam — Nepal Edition',
    intro:
      'Practise a safer choice in three everyday situations. About 3 minutes. No account needed.',
    kicker: 'A REAL-LIFE SAFETY MISSION',
    progress: 'Situation',
    of: 'of',
    fictional: 'Fictional practice message',
    question: 'What is the safer next step?',
    check: 'Check my choice',
    next: 'Next situation',
    finish: 'See my safety plan',
    correct: 'You chose the safer action.',
    learn: 'Let’s look at a safer action.',
    clue: 'What to notice',
    safer: 'Safer action',
    complete: 'Your safety plan',
    result: 'Safer first choices',
    plan: 'Pause. Keep secret codes private. Check through a trusted channel. Ask a trusted adult when unsure.',
    practice:
      'This is a practice result for this visit, not a measure of your overall digital-safety skills.',
    retry: 'Practise again',
    privacy: 'Your choices stay on this page. They are not saved or added to your XP.',
    sources: 'Safety guidance',
    resources: 'Explore learning resources',
  },
  ne: {
    title: 'ठगी चिन्नुहोस् — नेपाल संस्करण',
    intro:
      'दैनिक जीवनका तीन अवस्थामा सुरक्षित कदम रोज्ने अभ्यास गर्नुहोस्। करिब ३ मिनेट। खाता चाहिँदैन।',
    kicker: 'दैनिक जीवनको सुरक्षा अभ्यास',
    progress: 'अवस्था',
    of: '/',
    fictional: 'अभ्यासका लागि काल्पनिक सन्देश',
    question: 'अबको सुरक्षित कदम के हो?',
    check: 'मेरो उत्तर जाँच्नुहोस्',
    next: 'अर्को अवस्था',
    finish: 'मेरो सुरक्षा योजना हेर्नुहोस्',
    correct: 'तपाईंले सुरक्षित कदम रोज्नुभयो।',
    learn: 'अझ सुरक्षित कदम हेरौँ।',
    clue: 'ध्यान दिनुपर्ने कुरा',
    safer: 'सुरक्षित कदम',
    complete: 'तपाईंको सुरक्षा योजना',
    result: 'पहिलो प्रयासमा सुरक्षित छनोट',
    plan: 'पहिले रोकिनुहोस्। गोप्य कोड गोप्य राख्नुहोस्। विश्वासिलो माध्यमबाट जाँच गर्नुहोस्। शङ्का लागे विश्वासिलो वयस्कलाई सोध्नुहोस्।',
    practice: 'यो यस पटकको अभ्यासको नतिजा हो, तपाईंको समग्र डिजिटल सुरक्षा सीपको मापन होइन।',
    retry: 'फेरि अभ्यास गर्नुहोस्',
    privacy: 'तपाईंका उत्तर यही पृष्ठमा मात्र रहन्छन्। तिनलाई सुरक्षित गरिँदैन वा XP मा जोडिँदैन।',
    sources: 'सुरक्षा जानकारी',
    resources: 'सिकाइ सामग्री हेर्नुहोस्',
  },
} as const;
