import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080808] text-white pt-24 pb-12 px-6 md:px-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <Link href="/" className="text-4xl font-black tracking-tighter">
            AAREN<span className="text-accent">.</span>
          </Link>
          <p className="mt-6 text-muted-foreground max-w-sm text-sm leading-relaxed">
            Aaren Creative Studio is a global creative powerhouse specializing in next-generation branding, motion design, 3D animations, and immersive WebGL experiences.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-6">Explore</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li><Link href="/work" className="hover:text-white transition-colors">Work</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Studio</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-6">Contact</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li>info@aaren.com</li>
            <li>+91-9876543210</li>
            <li>Bangalore, Karnataka, India</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} Aaren Creative Studio. Inspired by STURDY.CO. Made for premium delivery.</p>
        <div className="flex space-x-6">
          <Link href="/admin/login" className="hover:text-white transition-colors">CMS Admin Panel</Link>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
