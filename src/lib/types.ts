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
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutMission?: string;
  aboutVision?: string;
  aboutValues?: string;
  textCase?: "proper" | "uppercase" | "lowercase";
};

export type CategoryItem = {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  shortCode: string;
  sequenceNumber: number;
};

export type CollectionItem = {
  id: string;
  name: string;
  brandId: string;
  brandName?: string;
  iconUrl?: string;
  description?: string;
  sequenceNumber?: number;
  featured?: boolean;
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
  pdfCatalogs?: { id: string; title: string; pdfUrl: string; coverImage?: string }[];
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

export type CareerItem = {
  id: string;
  title: string;
  department: string;
  location: string;
  type?: string;
  description?: string;
  createdAt?: string;
};

export type TeamGroup = "Leadership" | "Team";
export type TeamDepartment = "Sales" | "Operations" | "Installation" | "Support Staff" | string;

export type TeamMemberItem = {
  id: string;
  name: string;
  designation: string;
  category?: "Sales" | "Operations" | "Installation" | "Support Staff" | "Leadership" | string;
  group?: TeamGroup;
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
  source?: "form" | "auto-logged-in" | string;
  isLoggedIn?: boolean;
  userRole?: string;
  createdAt: string;
};

export type PdfViewLogItem = {
  id: string;
  leadId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  pdfName: string;
  pdfUrl?: string;
  source: "form" | "auto-logged-in" | string;
  createdAt: string;
};

export const DEFAULT_SETTINGS: SiteSettingsItem = {
  heroTitle: "AAREN",
  heroTagline: "Material Lab",
  heroSubtext: "Architectural surfaces, luxury furniture, and bespoke interior solutions.",
  heroVideoUrl: "/hero_bg.mp4",
  heroCategories: ["Plywood", "Decorative surfaces", "Cladding & Decking", "Wooden flooring", "Screens", "Doors", "Windows", "Kitchen", "Wardrobe", "Hardware", "Partition", "FF&E", "Tiles", "Wellness"],
  contactEmail: "info@aarenintpro.com",
  contactPhone: "8884464444",
  contactAddress: "AAREN INTPRO, #342/8, NTY Layout, Mysore Road, Bangalore - 560026",
  googleMapUrl: "https://maps.google.com/?q=AAREN+INTPRO,+%23342/8,+NTY+Layout,+Mysore+Road,+Bangalore+-+560026",
  webhookUrl: "",
  websiteBgColor: "#E6E2D8",
  headingColor: "#81663F",
  textColor: "#1E1E1E",
  accentColor: "#81663F",
  textCase: "proper",
  footerLinks: ["All Projects", "Brands", "Products", "Instagram", "FAQ", "Blog", "Privacy Policy"],
  socialLinks: [
    "https://www.instagram.com/aaren_intpro",
    "https://www.facebook.com/@aarenintproindia",
    "https://www.linkedin.com/company/aaren-intpro/",
    "https://x.com/mustbeaaren",
    "https://youtube.com/@aaren_intpro"
  ],
  copyrightText: "AAREN © 2026. All rights reserved.",
  aboutTitle: "About Us",
  aboutSubtitle: "Aaren Intpro is Bengaluru's premier material house and luxury lifestyle curator, dedicated to providing world-class interior products under one roof.",
  aboutMission: "To provide premium, elite, and high-quality lifestyle products under one roof for the global Indian customer.",
  aboutVision: "To remain the primary one-stop destination for architects, interior designers, builders, and homeowners seeking world-class materials.",
  aboutValues: "Uniting as a family, prioritizing robust value systems, and providing curated designs focusing on unique client experiences.",
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

export interface DownloadPdfItem {
  id: string;
  title: string;
  fileName?: string;
  fileUrl: string; // Firebase Storage URL or direct PDF URL
  fileSize?: string;
  pageCount?: number;
  coverImage?: string; // 1st page cover thumbnail URL
  category?: string;
  tags?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandDownloadFolder {
  id: string; // brand slug/id, e.g. "slashform", "waltz"
  brandName: string;
  brandLogo?: string;
  brandCategory?: string;
  description?: string;
  folderColor?: string;
  sequenceNumber?: number;
  files: DownloadPdfItem[];
}

