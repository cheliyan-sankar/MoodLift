import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

const defaultMetadata: Metadata = {
  title: 'Progress & Profile - Track Your Emotional Wellness Journey | MoodLift',
  description: 'View your emotional wellness progress, track mood patterns, manage your profile, and monitor your mental health journey with detailed analytics.',
  keywords: 'emotional wellness progress, mood tracking, mental health profile, wellness analytics, progress tracking, mood patterns',
  openGraph: {
    title: 'Progress & Profile - Track Your Emotional Wellness Journey | MoodLift',
    description: 'View your emotional wellness progress, track mood patterns, manage your profile, and monitor your mental health journey with detailed analytics.',
    url: 'https://moodlift.com/progress',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-progress.jpg',
        width: 1200,
        height: 630,
        alt: 'Emotional Wellness Progress Tracking - MoodLift',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progress & Profile - Track Your Emotional Wellness Journey | MoodLift',
    description: 'View your emotional wellness progress, track mood patterns, manage your profile, and monitor your mental health journey with detailed analytics.',
    images: ['https://moodlift.com/images/og-progress.jpg'],
  },
  alternates: {
    canonical: '/progress',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/progress');
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
        url: 'https://moodlift.com/progress',
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

export default function ProgressLayout({
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
          "name": "Progress & Profile - MoodLift",
          "description": "Track your emotional wellness progress and manage your mental health journey.",
          "url": "/progress",
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