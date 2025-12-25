import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

const defaultMetadata: Metadata = {
  title: 'Discover - Explore Emotional Wellness Activities & Resources | MoodLift',
  description: 'Discover personalized emotional wellness activities, games, books, and resources tailored to your mood and mental health needs.',
  keywords: 'emotional wellness activities, mental health games, wellness resources, mood-based activities, mindfulness exercises, CBT activities',
  openGraph: {
    title: 'Discover - Explore Emotional Wellness Activities & Resources | MoodLift',
    description: 'Discover personalized emotional wellness activities, games, books, and resources tailored to your mood and mental health needs.',
    url: 'https://moodlift.com/discover',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-discover.jpg',
        width: 1200,
        height: 630,
        alt: 'Discover Emotional Wellness Activities - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover - Explore Emotional Wellness Activities & Resources | MoodLift',
    description: 'Discover personalized emotional wellness activities, games, books, and resources tailored to your mood and mental health needs.',
    images: ['https://moodlift.com/images/og-discover.jpg'],
  },
  alternates: {
    canonical: '/discover',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/discover');
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
        url: 'https://moodlift.com/discover',
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

export default function DiscoverLayout({
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
          "name": "Discover - MoodLift",
          "description": "Explore personalized emotional wellness activities, games, and resources.",
          "url": "/discover",
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