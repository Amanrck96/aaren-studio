import nodemailer from "nodemailer";

interface InquiryEmailPayload {
  name: string;
  email: string;
  phone: string;
  type?: string;
  productOrBrand?: string;
  subject?: string;
  message?: string;
}

export async function sendInquiryEmailNotification(data: InquiryEmailPayload) {
  const gmailUser = process.env.GMAIL_USER || "info@rbanmsfgc.edu.in";
  const gmailPass = process.env.GMAIL_APP_PASSWORD || "fzhqegcjicvqroea";
  const recipientEmail = process.env.INQUIRY_RECIPIENT_EMAIL || "amanrck69@gmail.com";

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const inquiryType = data.type || "General Website Inquiry";
    const subject = `🔔 New Website Lead [${inquiryType}]: ${data.name}`;

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; padding: 30px; color: #111111;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <div style="background: #8c764b; padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.1em;">AAREN STUDIO</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em;">New Customer Inquiry Notification</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 30px;">
            <p style="font-size: 15px; color: #334155; margin-top: 0;">You have received a new inquiry from the Aaren Studio website:</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 700; color: #8c764b; width: 140px;">Customer Name:</td>
                <td style="padding: 10px 0; color: #111111;">${data.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 700; color: #8c764b;">Email Address:</td>
                <td style="padding: 10px 0; color: #111111;"><a href="mailto:${data.email}" style="color: #8c764b; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 700; color: #8c764b;">Phone Number:</td>
                <td style="padding: 10px 0; color: #111111;"><a href="tel:${data.phone}" style="color: #111111; text-decoration: none;">${data.phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 700; color: #8c764b;">Inquiry Type:</td>
                <td style="padding: 10px 0; color: #111111;">${inquiryType}</td>
              </tr>
              ${
                data.productOrBrand
                  ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 0; font-weight: 700; color: #8c764b;">Product/Brand:</td>
                      <td style="padding: 10px 0; color: #111111;">${data.productOrBrand}</td>
                    </tr>`
                  : ""
              }
              ${
                data.subject
                  ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 0; font-weight: 700; color: #8c764b;">Subject:</td>
                      <td style="padding: 10px 0; color: #111111;">${data.subject}</td>
                    </tr>`
                  : ""
              }
            </table>

            ${
              data.message
                ? `<div style="margin-top: 24px; padding: 16px; background: #f8f9fa; border-left: 4px solid #8c764b; border-radius: 4px;">
                    <div style="font-size: 12px; font-weight: 700; color: #8c764b; text-transform: uppercase; margin-bottom: 6px;">Customer Message:</div>
                    <div style="font-size: 14px; color: #334155; line-height: 1.5; white-space: pre-line;">${data.message}</div>
                  </div>`
                : ""
            }

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
              This notification was generated automatically by Aaren Studio Web Server at ${new Date().toLocaleString()}.
            </div>
          </div>

        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Aaren Studio Web Leads" <${gmailUser}>`,
      to: recipientEmail,
      replyTo: data.email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email notification sent to info@aarenintpro.com successfully! MessageId:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("❌ Failed to send email notification:", err.message);
    return { success: false, error: err.message };
  }
}
