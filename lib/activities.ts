export interface Activity {
  id: number;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  category: string;
  createdAt: Date;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: 'Box Breathing',
    description: 'A simple breathing technique supported by CBT principles to help reduce stress.',
    icon: 'Wind',
    href: '/games/box-breathing',
    color: 'from-purple-400 to-pink-400',
    category: 'Breathing',
    createdAt: new Date('2025-11-26'),
  },
  {
    id: 2,
    title: 'Cognitive Grounding',
    description: 'Engage your mind with grounding techniques backed by cognitive behavioral therapy.',
    icon: 'Brain',
    href: '/games/cognitive-grounding',
    color: 'from-blue-400 to-cyan-400',
    category: 'Grounding',
    createdAt: new Date('2025-11-26'),
  },
  {
    id: 3,
    title: 'Self-Soothing',
    description: 'Learn techniques to calm your nervous system through sensory awareness.',
    icon: 'Heart',
    href: '/games/self-soothing',
    color: 'from-rose-400 to-orange-400',
    category: 'Sensory',
    createdAt: new Date('2025-11-26'),
  },
];
