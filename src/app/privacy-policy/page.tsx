"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        {/* Header */}
        <header className="privacy-header">
          <span className="privacy-tag">LEGAL & GOVERNANCE</span>
          <h1 className="privacy-title">PRIVACY POLICY</h1>
          <p className="privacy-meta">
            Effective Date: January 1, 2026 · Last Updated: July 26, 2026
          </p>
        </header>

        {/* Content Section */}
        <main className="privacy-body">
          <div className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              AAREN Studio (&quot;AAREN&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates as a premier Creative Studio and Architectural Material House dedicated to designing spatial experiences and distributing world-class material lines. This Privacy Policy outlines how we collect, use, process, and protect your personal information when you visit our website (aarenstudio.com), request material specifications, interact with our digital catalogs, or engage our architectural consultation services.
            </p>
          </div>

          <div className="privacy-section">
            <h2>2. Information We Collect</h2>
            <p>
              We collect information that enables us to provide personalized architectural solutions, catalog dispatch, and seamless project collaboration:
            </p>
            <ul>
              <li>
                <strong>Contact Information:</strong> Full name, professional email address, phone number, company name, and physical delivery address provided when submitting inquiry forms or requesting physical sample kits.
              </li>
              <li>
                <strong>Project Specifications:</strong> Architectural drawings, design preferences, material quantities, project timelines, and budget metrics shared during project consultations.
              </li>
              <li>
                <strong>Technical &amp; Usage Data:</strong> IP address, browser type, device identifiers, referral URLs, page view statistics, and interaction telemetry captured via cookies and web analytics.
              </li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>
              Your data is utilized strictly to fulfill legitimate business and spatial design services, including:
            </p>
            <ul>
              <li>Processing and delivering material sample requests and custom catalog dispatches.</li>
              <li>Conducting architectural consultations and providing technical specification sheets.</li>
              <li>Managing client accounts, quotation pipelines, and procurement agreements.</li>
              <li>Sending curated studio updates, brand partnership announcements, and exhibition invitations (with opt-out controls).</li>
              <li>Enhancing website performance, user navigation, and digital security.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>4. Data Sharing &amp; Brand Partners</h2>
            <p>
              AAREN acts as an exclusive partner for international material manufacturers (such as Formica, Newtech Wood, Falper, Mafi, Waltz by JB Glass, and Slashform). To fulfill specific product orders or technical warranties, we may share relevant project details with designated brand partners or logistics carriers under strict confidentiality obligations.
            </p>
            <p>
              We do <strong>NOT</strong> sell, rent, or trade your personal information to third-party advertisers.
            </p>
          </div>

          <div className="privacy-section">
            <h2>5. Cookies &amp; Tracking Technologies</h2>
            <p>
              We employ essential cookies and performance analytics to optimize your experience on our website. You can configure your browser preferences to disable non-essential cookies; however, certain interactive catalog features may be affected.
            </p>
          </div>

          <div className="privacy-section">
            <h2>6. Data Security &amp; Retention</h2>
            <p>
              We implement industry-standard encryption, SSL protocols, and access controls to safeguard your data against unauthorized access, disclosure, or alteration. We retain personal data only for as long as necessary to fulfill project requirements, legal obligations, and accounting records.
            </p>
          </div>

          <div className="privacy-section">
            <h2>7. Your Rights &amp; Choices</h2>
            <p>Depending on your jurisdiction, you have the right to:</p>
            <ul>
              <li>Access a copy of the personal data we hold about you.</li>
              <li>Request corrections or updates to inaccurate information.</li>
              <li>Request the deletion or restriction of your personal data.</li>
              <li>Opt-out of marketing communications at any time by clicking the &quot;Unsubscribe&quot; link or emailing our privacy officer.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy, please contact our Data Governance Officer at:
            </p>
            <div className="contact-box">
              <p><strong>AAREN Creative Studio &amp; Material House</strong></p>
              <p>Email: <a href="mailto:hello@aarenstudio.com">hello@aarenstudio.com</a></p>
              <p>Phone: +91 98200 00000</p>
              <p>Address: Aaren Studio Atelier, Lower Parel, Mumbai, MH 400013, India</p>
            </div>
          </div>
        </main>

        {/* Footer Link */}
        <div className="privacy-back">
          <Link href="/" className="back-link">
            ← Return to Home Page
          </Link>
        </div>
      </div>

      <style>{`
        .privacy-page {
          background: #eaeef4;
          color: #111111;
          min-height: 100vh;
          padding-top: 10rem;
          padding-bottom: 8rem;
          font-family: var(--font-geist), sans-serif;
        }

        .privacy-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 2.4rem;
        }

        .privacy-header {
          padding-bottom: 4rem;
          border-bottom: 1px solid rgba(0,0,0,0.12);
          margin-bottom: 4rem;
        }

        .privacy-tag {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(0,0,0,0.4);
          display: block;
          margin-bottom: 1.6rem;
        }

        .privacy-title {
          font-size: clamp(3.6rem, 7vw, 8rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.95;
          color: #000000;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .privacy-meta {
          font-size: 1.3rem;
          color: rgba(0,0,0,0.5);
          font-weight: 500;
        }

        .privacy-body {
          display: flex;
          flex-direction: column;
          gap: 3.6rem;
        }

        .privacy-section h2 {
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000000;
          margin-bottom: 1.6rem;
          text-transform: none;
        }

        .privacy-section p {
          font-size: 1.5rem;
          line-height: 1.7;
          color: rgba(0,0,0,0.7);
          margin-bottom: 1.2rem;
          font-weight: 400;
        }

        .privacy-section ul {
          padding-left: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.2rem;
        }

        .privacy-section li {
          font-size: 1.5rem;
          line-height: 1.6;
          color: rgba(0,0,0,0.7);
        }

        .contact-box {
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 0.6rem;
          padding: 2.4rem;
          margin-top: 1.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 1.4rem;
        }

        .contact-box a {
          color: #000000;
          font-weight: 700;
          text-decoration: underline;
        }

        .privacy-back {
          margin-top: 6rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(0,0,0,0.12);
        }

        .back-link {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #000000;
          text-decoration: none;
        }

        .back-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
