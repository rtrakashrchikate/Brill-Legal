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

export const QUERY_PRACTICES = /* GraphQL */ `
  query Practices($first: Int = 20) {
    practices(first: $first) {
      nodes {
        title
        slug
        verticals { nodes { slug } }
        practiceFields {
          shortLabel
          heroIntro
          overview
          summary
          matterType
          orderNo
          capabilities { item }
        }
      }
    }
  }
`;

export const QUERY_PEOPLE = /* GraphQL */ `
  query People($first: Int = 50) {
    people(first: $first) {
      nodes {
        title
        slug
        personFields {
          roleTitle
          bio
          practiceFocus
          education
          enrolment
          displayOrder
          linkedinUrl
          practices { nodes { ... on Practice { slug } } }
        }
      }
    }
  }
`;

export const QUERY_LOCATIONS = /* GraphQL */ `
  query Locations($first: Int = 100) {
    locations(first: $first) {
      nodes {
        title
        slug
        cities { nodes { slug name } }
        verticals { nodes { slug } }
        locationFields {
          serviceLabel
          cityLabel
          localIntro
          localCourts
          seoTitle
          metaDescription
          relatedPractice { nodes { ... on Practice { slug } } }
          relatedArticles { nodes { ... on Post { slug } } }
          faq { question answer }
        }
      }
    }
  }
`;

export const QUERY_GLOSSARY = /* GraphQL */ `
  query Glossary($first: Int = 200) {
    glossaryTerms(first: $first) {
      nodes {
        title
        slug
        glossaryFields {
          definition
          relatedPractice { nodes { ... on Practice { slug } } }
          relatedArticle { nodes { ... on Post { slug } } }
        }
      }
    }
  }
`;

export const QUERY_RESOURCES = /* GraphQL */ `
  query Resources($first: Int = 50) {
    resources(first: $first) {
      nodes {
        title
        slug
        resourceFields {
          summary
          gateEmail
          items { item }
          relatedPractice { nodes { ... on Practice { slug } } }
          relatedArticle { nodes { ... on Post { slug } } }
        }
      }
    }
  }
`;

export const QUERY_NEWS = /* GraphQL */ `
  query News($first: Int = 50) {
    newsItems(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        title
        slug
        content
        newsFields {
          summary
          date
          category
        }
      }
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
