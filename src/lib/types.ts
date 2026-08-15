export type SiteSettingsItem = {
  heroTitle: string;
  heroTagline: string;
  heroSubtext: string;
  heroVideoUrl: string;
  heroCategories: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  googleMapUrl: string;
  webhookUrl: string;
  footerLinks: string[];
  socialLinks: string[];
  copyrightText: string;
  websiteBgColor?: string;
  headingColor?: string;
  textColor?: string;
  accentColor?: string;
};

export type CategoryItem = {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  shortCode: string;
  sequenceNumber: number;
};

export type BrandItem = {
  id: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  shortCode: string;
  sequenceNumber: number;
  catalogPdfUrl?: string;
  pdfCatalogs?: { id: string; title: string; pdfUrl: string }[];
  category?: string;
  origin?: string;
  tagline?: string;
  founded?: string;
  website?: string;
  collections?: string[];
  accentColor?: string;
  tags?: string[];
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  category?: string;
  buttonText?: string;
  buttonLink?: string;
  seoUrl?: string;
  sequenceNumber: number;
};

export type TestimonialItem = {
  id: string;
  clientName: string;
  company: string;
  rating: number;
  review: string;
  clientImage?: string;
  sequenceNumber: number;
};

export type BlogItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  featuredImage: string;
  author: string;
  publishDate?: string;
  status: "Draft" | "Published";
  createdAt?: string;
  sequenceNumber?: number;
  titleSize?: string;
  bodySize?: string;
  imageHeight?: string;
};

export type BlogSettingsItem = {
  articleTitleSize: string;
  articleBodySize: string;
  cardTitleSize: string;
  cardBodySize: string;
  articleImageHeight?: string;
  cardImageHeight?: string;
};

export type MediaAsset = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: "Image" | "Video" | "PDF" | "Document";
  folder: string;
  altText?: string;
  size?: string;
  createdAt?: string;
};

export type TaxonomyItem = {
  id: string;
  type: "Category" | "Technology" | "ProjectType" | "Status" | "Tag";
  name: string;
  code?: string;
  sequenceNumber: number;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  sequenceNumber: number;
  isExternal: boolean;
};

export type SeoItem = {
  id: string;
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  ogImage?: string;
};

export type ProductItem = {
  id: string;
  slNo?: number;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  shortCode?: string;
  sku?: string;
  width?: string;
  height?: string;
  depth?: string;
  measurementType?: string;
  thickness?: string;
  finish?: string;
  material?: string;
  origin?: string;
  leadTime?: string;
  warranty?: string;
  features?: string[];
  applicationAreas?: string[];
  description: string;
  tags?: string[];
  imageUrl: string;
  galleryImages?: string[];
  catalogPdfUrl?: string;
  qtyInStock?: number;
  price?: number;
  priceUnit?: string;
  finishOptions?: { name: string; hex?: string; image?: string }[];
};

export type ProjectShowcaseItem = {
  id: string;
  title: string;
  slug?: string;
  description: string;
  category: string;
  client: string;
  projectCode?: string;
  sequenceNumber?: number;
  imageUrl?: string;
  gallery?: string[];
  pdfUrl?: string;
  selectedProducts?: any[];
  createdAt?: string;
};

export type ProjectItem = ProjectShowcaseItem;

export type TeamMemberItem = {
  id: string;
  name: string;
  designation: string;
  category?: "Sales" | "Operations" | "Installation" | "Support Staff" | "Leadership" | string;
  memberCode: string;
  photoUrl: string;
  phone?: string;
  bio: string;
  linkedin?: string;
  instagram?: string;
  sequenceNumber: number;
};

export type RoadmapStepItem = {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  year?: string;
};

export type TeamJoinBanner = {
  title: string;
  fontSize: "small" | "medium" | "large";
  hoursText: string;
  phone: string;
  email: string;
  address: string;
};

export type CustomPageSection = {
  id: string;
  type: "Hero" | "Banner" | "Services" | "Portfolio" | "Gallery" | "Testimonials" | "FAQ" | "RichText";
  title: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  isVisible: boolean;
  order: number;
};

export type CustomPageItem = {
  id: string;
  title: string;
  slug: string;
  status: "Published" | "Draft";
  seoTitle?: string;
  seoDescription?: string;
  sections: CustomPageSection[];
  createdAt?: string;
};

export type PdfCatalogItem = {
  id: string;
  title: string;
  fileName: string;
  primaryFileName?: string;
  fileUrl: string;
  pdfUrl?: string;
  thumbnailUrl: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  tags?: string[];
  fileSize: string;
  sizeBytes?: number;
  pageCount: number;
  isLocked: boolean;
  downloadCount: number;
  createdAt: string;
};

export type InquiryItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  subject?: string;
  message?: string;
  productOrBrand?: string;
  downloadedFileName?: string;
  catalogId?: string;
  profession?: string;
  city?: string;
  createdAt: string;
};

export const DEFAULT_SETTINGS: SiteSettingsItem = {
  heroTitle: "AAREN",
  heroTagline: "Creative Studio & Material Lab",
  heroSubtext: "Architectural surfaces, luxury furniture, and bespoke interior solutions.",
  heroVideoUrl: "/hero_bg.mp4",
  heroCategories: ["Plywood", "Laminate", "Facade", "Wooden Flooring", "Screens", "Door System", "Doors", "Windows", "Kitchen", "Wardrobe", "Furniture", "Tiles", "Bathroom Fittings", "Sanitary Ware", "Mirrors"],
  contactEmail: "info@aarenintpro.com",
  contactPhone: "8884464444",
  contactAddress: "AAREN INTPRO, #342/8, NTY Layout, Mysore Road, Bangalore - 560026",
  googleMapUrl: "https://maps.google.com/?q=Mysore+Road+Bangalore",
  webhookUrl: "",
  websiteBgColor: "#E6E2D8",
  headingColor: "#81663F",
  textColor: "#1E1E1E",
  accentColor: "#81663F",
  footerLinks: ["All Projects", "Brands", "Products", "Instagram", "FAQ", "Blog", "Privacy Policy"],
  socialLinks: [
    "https://www.instagram.com/aaren_intpro",
    "https://www.facebook.com/@aarenintproindia",
    "https://www.linkedin.com/company/aaren-intpro/",
    "https://x.com/mustbeaaren",
    "https://youtube.com/@aaren_intpro"
  ],
  copyrightText: "AAREN © 2026. All rights reserved.",
};

export type CatalogSettingsItem = {
  modalBgColor: string;
  modalTextColor: string;
  cardBgColor: string;
  cardTextColor: string;
  badgeText: string;
  buttonText: string;
  modalTitle: string;
  modalSubtext: string;
};

export const DEFAULT_CATALOG_SETTINGS: CatalogSettingsItem = {
  modalBgColor: "linear-gradient(145deg, #181920 0%, #0b0c10 100%)",
  modalTextColor: "#ffffff",
  cardBgColor: "#ffffff",
  cardTextColor: "#0f172a",
  badgeText: "OFFICIAL CATALOGUE",
  buttonText: "View Catalog ↗",
  modalTitle: "Catalogue Enquiry",
  modalSubtext: "Submit your details below to view on-screen digital access for this official architectural specification PDF.",
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  brand?: string;
  sequenceNumber?: number;
};
