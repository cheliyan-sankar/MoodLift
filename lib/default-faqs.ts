export type DefaultFaqPage = 'home' | 'games' | 'discover' | 'assessment';

export type DefaultFaqItem = {
  question: string;
  answer: string;
  sort_order: number;
};

export const DEFAULT_FAQS: Record<DefaultFaqPage, DefaultFaqItem[]> = {
  home: [
    {
      sort_order: 0,
      question: 'What is MoodLift?',
      answer:
        'MoodLift is an AI-powered emotional wellness platform that combines psychometric assessments, therapeutic games, breathing exercises, and personalized recommendations to support your mental health journey.',
    },
    {
      sort_order: 1,
      question: 'How accurate are the mood assessments?',
      answer:
        'Our assessments use validated psychometric scales (PHQ-9, GAD-7, PANAS-SF) developed by leading mental health researchers. These are the same tools used in clinical settings worldwide.',
    },
    {
      sort_order: 2,
      question: 'Are the games scientifically backed?',
      answer:
        'Yes! All our games and activities are based on evidence-based therapeutic techniques like CBT, MBSR, DBT, and somatic practices. Each game comes with detailed information about its mood benefits.',
    },
    {
      sort_order: 3,
      question: 'Is my data secure and private?',
      answer:
        'Absolutely. We use enterprise-grade encryption, secure servers, and comply with GDPR and data protection regulations. Your personal data is never shared with third parties.',
    },
    {
      sort_order: 4,
      question: 'Can I use MoodLift as a replacement for therapy?',
      answer:
        "MoodLift is designed to complement, not replace, professional mental health treatment. If you're experiencing a mental health crisis, please reach out to a healthcare professional or crisis helpline immediately.",
    },
    {
      sort_order: 5,
      question: 'How do I pin my favorite games?',
      answer:
        "Simply click the pin icon on any game card to save it to your favorites. Your pinned games appear in the 'Your Favorites' section for quick access.",
    },
  ],
  games: [
    {
      sort_order: 0,
      question: 'How long does each activity take?',
      answer: 'Most activities take 3-15 minutes. Specific durations are displayed on each game card and in the detailed view.',
    },
    {
      sort_order: 1,
      question: "What's the difference between breathing exercises and grounding techniques?",
      answer:
        'Breathing exercises focus on controlling your breath to calm the nervous system. Grounding techniques use sensory awareness to bring you into the present moment and reduce anxiety.',
    },
    {
      sort_order: 2,
      question: 'Can I practice activities multiple times?',
      answer:
        'Yes! You can practice any activity as many times as you like. Regular practice enhances the benefits. We track your activity history in your dashboard.',
    },
    {
      sort_order: 3,
      question: "Which game should I start with if I'm new?",
      answer:
        "We recommend starting with Box Breathing or Describe Your Room if you're new to wellness activities. These are gentle, easy-to-follow exercises perfect for beginners.",
    },
    {
      sort_order: 4,
      question: 'How do I know which game is right for my mood?',
      answer:
        "Take our Mood Assessment first! Based on your results, we'll recommend specific games tailored to your emotional state and wellness goals.",
    },
    {
      sort_order: 5,
      question: 'Are games available offline?',
      answer:
        'Games work best online for the full experience, but you can access descriptions and benefits offline. The activities themselves are web-based.',
    },
  ],
  discover: [
    {
      sort_order: 0,
      question: "What's the difference between the Discover page and the Games page?",
      answer:
        'The Discover page is your personalized hub with your favorites, all activities, and book recommendations. The Games page focuses specifically on wellness games and activities.',
    },
    {
      sort_order: 1,
      question: 'How do I add games and books to my favorites?',
      answer:
        "Click the pin icon on any game or book card. Your favorites appear in the 'Your Favorites' section for quick access. You can manage favorites from any page.",
    },
    {
      sort_order: 2,
      question: 'Can I get book recommendations based on my mood?',
      answer:
        "Yes! After completing a mood assessment, we recommend books tailored to your emotional state and wellness goals. You'll see personalized suggestions on the Discover page.",
    },
    {
      sort_order: 3,
      question: 'How do I start using the recommended resources?',
      answer:
        "Browse the Activities and Books sections, click on any item to see details, then click 'Start Playing' for games or 'Learn More' for books. Everything is accessible from the Discover page.",
    },
    {
      sort_order: 4,
      question: 'Can I view my progress with different games and books?',
      answer:
        'Yes! Visit your Dashboard to see your activity history, progress over time, and insights about your wellness journey.',
    },
    {
      sort_order: 5,
      question: 'Are the book recommendations free?',
      answer:
        'We provide detailed recommendations and summaries. Links are provided to purchase or borrow books from various platforms. Some resources may be available free online.',
    },
  ],
  assessment: [
    {
      sort_order: 0,
      question: 'What is the PANAS-SF assessment?',
      answer:
        'The PANAS-SF (Positive and Negative Affect Schedule - Short Form) is a 20-item self-report measure that assesses your current emotional state by measuring positive affect (PA) and negative affect (NA). It provides a quick snapshot of your mood and emotions.',
    },
    {
      sort_order: 1,
      question: 'What is the PHQ-9 assessment?',
      answer:
        'The PHQ-9 (Patient Health Questionnaire-9) is a 9-item screening tool for depression based on DSM-IV diagnostic criteria. It measures the severity of depressive symptoms and is widely used in clinical and primary care settings.',
    },
    {
      sort_order: 2,
      question: 'What is the GAD-7 assessment?',
      answer:
        'The GAD-7 (Generalized Anxiety Disorder-7) is a 7-item self-report measure that assesses the severity of anxiety symptoms. It helps identify and measure the severity of generalized anxiety disorder.',
    },
    {
      sort_order: 3,
      question: 'How long do the assessments take?',
      answer:
        'Each assessment typically takes 2-3 minutes to complete. They are designed to be quick yet comprehensive, allowing you to get meaningful insights about your mental health state without taking too much of your time.',
    },
    {
      sort_order: 4,
      question: 'Are these assessments scientifically validated?',
      answer:
        'Yes, all three assessments are scientifically validated and widely used in clinical and research settings. PANAS-SF, PHQ-9, and GAD-7 have been validated across diverse populations and are recommended by mental health organizations.',
    },
    {
      sort_order: 5,
      question: 'Can I retake the assessments?',
      answer:
        'Absolutely! You can retake any assessment at any time. Taking assessments regularly helps you track your mood changes over time and see how your mental health is progressing.',
    },
  ],
};
