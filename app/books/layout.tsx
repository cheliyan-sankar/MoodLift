import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo-service';
import StructuredData from '@/components/structured-data';

const defaultMetadata: Metadata = {
  title: 'Book Recommendations - Mood-Based Reading for Emotional Wellness',
  description: 'Discover personalized book recommendations based on your mood and emotional state. Find the perfect books to support your mental health and emotional well-being journey.',
  keywords: 'book recommendations, mood-based books, emotional wellness reading, mental health books, self-help books, mindfulness books',
  openGraph: {
    title: 'Book Recommendations - Mood-Based Reading for Emotional Wellness',
    description: 'Discover personalized book recommendations based on your mood and emotional state. Find the perfect books to support your mental health journey.',
    url: 'https://moodlift.com/books',
    siteName: 'MoodLift',
    images: [
      {
        url: 'https://moodlift.com/images/og-books.jpg',
        width: 1200,
        height: 630,
        alt: 'Mood-Based Book Recommendations for Emotional Wellness',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Recommendations - Mood-Based Reading for Emotional Wellness',
    description: 'Discover personalized book recommendations based on your mood and emotional state. Find the perfect books to support your mental health journey.',
    images: ['https://moodlift.com/images/og-books.jpg'],
  },
  alternates: {
    canonical: '/books',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoMetadata('/books');
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
        url: 'https://moodlift.com/books',
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

export default function BooksLayout({
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
          "name": "Book Recommendations - MoodLift",
          "description": "Discover personalized book recommendations based on your mood and emotional state for better mental health and well-being.",
          "url": "/books",
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