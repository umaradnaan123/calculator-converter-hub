import React from 'react';

/**
 * Schema Markup Implementation
 * These components inject structured JSON-LD data into pages.
 */

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
}

interface ToolSchemaProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

// 1. ORGANIZATION SCHEMA (Homepage)
export function OrganizationSchema({
  name = 'Calculator & Converter Hub',
  description = 'Free online calculators and converters for finance, health, travel, and more.',
  url = 'https://calculator-converter-hub.vercel.app',
  logo = 'https://calculator-converter-hub.vercel.app/logo.png',
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url,
    logo,
    sameAs: [
      'https://twitter.com/yourhandle',
      'https://facebook.com/yourpage',
      'https://linkedin.com/company/yourcompany',
      'https://instagram.com/yourhandle',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@calculator-converter-hub.vercel.app',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 2. WEBSITE SCHEMA + SEARCH ACTION
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://calculator-converter-hub.vercel.app',
    name: 'Calculator & Converter Hub',
    description: '50+ free online calculators and unit converters',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://calculator-converter-hub.vercel.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 3. WEB APPLICATION SCHEMA (Tool Pages)
export function ToolSchema({
  name,
  description,
  url,
  datePublished = new Date().toISOString().split('T')[0],
  dateModified = new Date().toISOString().split('T')[0],
  image,
}: ToolSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'Utility',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Calculator & Converter Hub',
      url: 'https://calculator-converter-hub.vercel.app',
    },
    datePublished,
    dateModified,
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 4. BREADCRUMB LIST SCHEMA
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 5. FAQ PAGE SCHEMA
export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 6. ARTICLE/BLOG POSTING SCHEMA
interface ArticleSchemaProps {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}

export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName = 'Calculator & Converter Hub',
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Calculator & Converter Hub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://calculator-converter-hub.vercel.app/logo.png',
      },
    },
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 7. RATING AGGREGATE SCHEMA
interface AggregateRatingSchemaProps {
  ratingValue: number;
  ratingCount: number;
  reviewCount?: number;
}

export function AggregateRatingSchema({
  ratingValue,
  ratingCount,
  reviewCount,
}: AggregateRatingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue,
    ratingCount,
    ...(reviewCount && { reviewCount }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// HOOK: useSchemaMarkup (For Dynamic Content)
export function useSchemaMarkup(schema: Record<string, any>) {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    script.id = 'schema-markup';

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('schema-markup');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [schema]);
}
