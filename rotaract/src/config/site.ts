export const site = {
  name: "Rotaract Club of Pune Metro",
  shortName: "RAC Pune Metro",
  tagline: "Service above self. Designed for the next generation.",
  description:
    "The official home of the Rotaract Club of Pune Metro — projects, publications, people and a district-wide requirement hub where any Rotaractor can ask for help.",
  district: "RID 3131",
  chartered: 2004,
  url: "https://rotaract-pune-metro.example.org",
  email: "hello@racpunemetro.org",
  whatsapp: "+91 98220 00000",
  address: "Deccan Gymkhana, Pune, Maharashtra 411004",
  socials: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blogs" },
  { href: "/members", label: "Members & BOD" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "Rotaract News" },
  { href: "/hub", label: "Requirement Hub" },
] as const;

export const AVENUES = [
  "Community Service",
  "Professional Development",
  "Club Service",
  "International Service",
  "Environment",
] as const;

export const IMPACT_AREAS = [
  "Disease Prevention",
  "Basic Education & Literacy",
  "Water & Sanitation",
  "Environment",
  "Community Economic Development",
  "Maternal & Child Health",
  "Peacebuilding",
] as const;

export const DISTRICTS = [
  "RID 3131",
  "RID 3132",
  "RID 3141",
  "RID 3142",
  "RID 3170",
  "RID 3201",
] as const;
