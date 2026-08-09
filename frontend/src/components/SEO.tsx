import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  structuredData?: Record<string, any>;
  lang?: string;
}

const SITE_URL = "https://sallehub.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  structuredData,
  lang = "en",
}: SEOProps) {
  const fullTitle = title.includes("ChurchTrack") ? title : `${title} | ChurchTrack`;
  const canonicalUrl = canonical || SITE_URL;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ChurchTrack",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "description": "Parish services platform for ChurchTrack wedding ceremonies and SalleHub hall reservations.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@sallehub.com",
      "availableLanguage": ["English", "French", "Kinyarwanda"]
    },
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ChurchTrack",
    "url": SITE_URL,
    "description": "Parish wedding and hall reservation platform",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/catalogue?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const combinedSchema = structuredData
    ? { ...organizationSchema, ...structuredData }
    : organizationSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <html lang={lang} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ChurchTrack" />
      <meta property="og:locale" content={lang === "FR" ? "fr_FR" : lang === "RW" ? "rw_RW" : "en_US"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
      {websiteSchema && (
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      )}
    </Helmet>
  );
}