import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

const defaultMetadata: Metadata = {
  title: 'Rewards & Achievements - Earn Points for Emotional Wellness | MoodLift',
  description: 'Earn points, unlock achievements, and track your progress as you complete emotional wellness activities and maintain healthy mental health habits.',
  keywords: 'emotional wellness rewards, mental health achievements, wellness points, habit tracking, mental health badges, wellness milestones',
  openGraph: {
    title: 'Rewards & Achievements - Earn Points for Emotional Wellness | MoodLift',
    description: 'Earn points, unlock achievements, and track your progress as you complete emotional wellness activities and maintain healthy mental health habits.',
    url: 'https://moodlift.com/rewards',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-rewards.jpg',
        width: 1200,
        height: 630,
        alt: 'Emotional Wellness Rewards & Achievements - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rewards & Achievements - Earn Points for Emotional Wellness | MoodLift',
    description: 'Earn points, unlock achievements, and track your progress as you complete emotional wellness activities and maintain healthy mental health habits.',
    images: ['https://moodlift.com/images/og-rewards.jpg'],
  },
  alternates: {
    canonical: '/rewards',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/rewards');
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
        url: 'https://moodlift.com/rewards',
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

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Rewards & Achievements - MoodLift",
          "description": "Earn points and unlock achievements for completing emotional wellness activities.",
          "url": "/rewards",
          "publisher": {
            "@type": "Organization",
            "name": "MoodLift",
            "url": "https://moodlift.com"
          }
        }}
      />
      {children}
    </>
  );
}