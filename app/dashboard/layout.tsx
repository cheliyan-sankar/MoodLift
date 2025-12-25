import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

const defaultMetadata: Metadata = {
  title: 'Dashboard - Track Your Emotional Wellness Progress | MoodLift',
  description: 'Monitor your emotional wellness journey with personalized insights, activity tracking, mood patterns, and progress analytics on your MoodLift dashboard.',
  keywords: 'emotional wellness dashboard, mood tracking, progress analytics, mental health insights, activity tracking, wellness metrics',
  openGraph: {
    title: 'Dashboard - Track Your Emotional Wellness Progress | MoodLift',
    description: 'Monitor your emotional wellness journey with personalized insights, activity tracking, mood patterns, and progress analytics.',
    url: 'https://moodlift.com/dashboard',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'MoodLift Dashboard - Emotional Wellness Progress Tracking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard - Track Your Emotional Wellness Progress | MoodLift',
    description: 'Monitor your emotional wellness journey with personalized insights, activity tracking, mood patterns, and progress analytics.',
    images: ['https://moodlift.com/images/og-dashboard.jpg'],
  },
  alternates: {
    canonical: '/dashboard',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/dashboard');
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
        url: 'https://moodlift.com/dashboard',
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

export default function DashboardLayout({
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
          "name": "Dashboard - MoodLift",
          "description": "Track your emotional wellness progress with personalized insights and analytics.",
          "url": "/dashboard",
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