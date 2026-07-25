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
};

export type ProductItem = {
  id: string;
  slNo?: number;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  shortCode?: string;
  width?: string;
  height?: string;
  depth?: string;
  measurementType?: string;
  thickness?: string;
  finish?: string;
  description: string;
  tags?: string[];
  imageUrl: string;
  galleryImages?: string[];
  catalogPdfUrl?: string;
  qtyInStock?: number;
  price?: number;
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

export type InquiryItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  subject?: string;
  message?: string;
  productOrBrand?: string;
  createdAt: string;
};

export const DEFAULT_SETTINGS: SiteSettingsItem = {
  heroTitle: "AAREN",
  heroTagline: "Creative Studio & Material Lab",
  heroSubtext: "Architectural surfaces, luxury furniture, and bespoke interior solutions.",
  heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-41564-large.mp4",
  heroCategories: ["Plywood", "Laminate", "Facade", "Wooden Flooring", "Screens", "Door System", "Doors", "Windows", "Kitchen", "Wardrobe", "Furniture", "Tiles", "Bathroom Fittings", "Sanitary Ware", "Mirrors"],
  contactEmail: "info@aarenintpro.com",
  contactPhone: "+91 98800 12345",
  contactAddress: "Mysore Road, Bangalore, Karnataka, India",
  googleMapUrl: "https://maps.google.com/?q=Mysore+Road+Bangalore",
  webhookUrl: "",
  footerLinks: ["All Projects", "Brands", "Products", "Instagram", "Privacy Policy"],
  socialLinks: ["https://instagram.com", "https://facebook.com", "https://linkedin.com", "https://youtube.com"],
  copyrightText: "AAREN © 2026. All rights reserved.",
};
