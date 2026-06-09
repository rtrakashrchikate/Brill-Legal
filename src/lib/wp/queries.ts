/**
 * GraphQL documents. Field names match the WordPress Setup Pack's ACF group
 * (`articleFields`) and CPT/taxonomy GraphQL names. The `articleFields` group
 * is extended with `isPillar` (true/false) so the front-end can distinguish
 * pillar vs cluster guides — see wordpress/mu-plugins.
 */

const ARTICLE_FIELDS = /* GraphQL */ `
  fragment ArticleParts on Post {
    title
    slug
    date
    content
    excerpt
    author { node { name slug } }
    verticals { nodes { slug name } }
    articleFields {
      seoTitle
      metaDescription
      readTime
      isPillar
      faq { question answer }
      relatedPractice { nodes { ... on Practice { slug } } }
      relatedArticles { nodes { ... on Post { slug } } }
    }
  }
`;

export const QUERY_ARTICLES = /* GraphQL */ `
  ${ARTICLE_FIELDS}
  query Articles($first: Int = 100) {
    posts(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes { ...ArticleParts }
    }
  }
`;

export const QUERY_ARTICLE_BY_SLUG = /* GraphQL */ `
  ${ARTICLE_FIELDS}
  query ArticleBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) { ...ArticleParts }
  }
`;

export const QUERY_ARTICLE_SLUGS = /* GraphQL */ `
  query ArticleSlugs($first: Int = 200) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes { slug }
    }
  }
`;

export const QUERY_SITE_SETTINGS = /* GraphQL */ `
  query SiteSettings {
    siteSettings {
      siteSettingsFields {
        firmName
        strapline
        phone
        whatsappNumber
        email
        officeAddress
        gbpUrl
        linkedinUrl
        footerDisclaimer
        officeHours
      }
    }
  }
`;

/**
 * Create an Enquiry record. Backed by a custom mutation registered in
 * wordpress/mu-plugins/brill-legal-headless.php (flat input, writes the CPT +
 * ACF meta server-side, so it does not depend on ACF mutation-input support).
 */
export const MUTATION_CREATE_ENQUIRY = /* GraphQL */ `
  mutation CreateEnquiry($input: CreateEnquiryInput!) {
    createEnquiry(input: $input) {
      success
      databaseId
    }
  }
`;
