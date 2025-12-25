import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

const defaultMetadata: Metadata = {
  title: 'All Activities - Complete Collection of Emotional Wellness Tools | MoodLift',
  description: 'Explore our complete collection of emotional wellness activities, games, and exercises designed to improve mental health and emotional well-being.',
  keywords: 'emotional wellness activities, mental health exercises, wellness games, mindfulness activities, CBT tools, breathing exercises',
  openGraph: {
    title: 'All Activities - Complete Collection of Emotional Wellness Tools | MoodLift',
    description: 'Explore our complete collection of emotional wellness activities, games, and exercises designed to improve mental health and emotional well-being.',
    url: 'https://moodlift.com/all-activities',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-activities.jpg',
        width: 1200,
        height: 630,
        alt: 'Complete Collection of Emotional Wellness Activities - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Activities - Complete Collection of Emotional Wellness Tools | MoodLift',
    description: 'Explore our complete collection of emotional wellness activities, games, and exercises designed to improve mental health and emotional well-being.',
    images: ['https://moodlift.com/images/og-activities.jpg'],
  },
  alternates: {
    canonical: '/all-activities',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/all-activities');
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
        url: 'https://moodlift.com/all-activities',
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

export default function AllActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData
        script={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "All Activities - MoodLift",
          "description": "Complete collection of emotional wellness activities and mental health exercises.",
          "url": "/all-activities",
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