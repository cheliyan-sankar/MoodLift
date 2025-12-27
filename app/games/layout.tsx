import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

export const dynamic = 'force-dynamic';

const defaultMetadata: Metadata = {
  title: 'Games & Activities - Interactive Emotional Wellness Tools | MoodLift',
  description: 'Play interactive emotional wellness games and activities including breathing exercises, CBT challenges, grounding techniques, and mindfulness activities.',
  keywords: 'emotional wellness games, breathing exercises, CBT activities, grounding techniques, mindfulness games, mental health activities',
  openGraph: {
    title: 'Games & Activities - Interactive Emotional Wellness Tools | MoodLift',
    description: 'Play interactive emotional wellness games and activities including breathing exercises, CBT challenges, grounding techniques, and mindfulness activities.',
    url: 'https://moodlift.com/games',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-games.jpg',
        width: 1200,
        height: 630,
        alt: 'Interactive Emotional Wellness Games - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games & Activities - Interactive Emotional Wellness Tools | MoodLift',
    description: 'Play interactive emotional wellness games and activities including breathing exercises, CBT challenges, grounding techniques, and mindfulness activities.',
    images: ['https://moodlift.com/images/og-games.jpg'],
  },
  alternates: {
    canonical: '/games',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/games');
    if (!seo) return defaultMetadata;

    const ogImages = seo.og_image ? [{ url: seo.og_image, alt: seo.title }] : defaultMetadata.openGraph?.images;

    return {
      title: seo.title || defaultMetadata.title,
      description: seo.description || defaultMetadata.description,
      keywords: seo.keywords || defaultMetadata.keywords,
      metadataBase: new URL('https://moodlift.com'),
      alternates: defaultMetadata.alternates,
      openGraph: {
        title: seo.title || defaultMetadata.openGraph?.title,
        description: seo.description || defaultMetadata.openGraph?.description,
        url: 'https://moodlift.com/games',
        siteName: defaultMetadata.openGraph?.siteName,
        images: ogImages as any,
        locale: defaultMetadata.openGraph?.locale,
      },
      twitter: {
        title: seo.title || defaultMetadata.twitter?.title,
        description: seo.description || defaultMetadata.twitter?.description,
        images: seo.og_image ? [seo.og_image] : defaultMetadata.twitter?.images,
      },
    } as Metadata;
  } catch (err) {
    console.error('Error generating metadata:', err);
    return defaultMetadata;
  }
}

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}