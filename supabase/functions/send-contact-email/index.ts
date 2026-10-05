import { SmtpClient } from "npm:smtp@0.1.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  services?: string;
  budget?: string;
  message: string;
}

const recipientEmail = "fizawebstudio@gmail.com";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function createEmailTemplate(data: ContactFormData, submittedAt: string): string {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone || "Not provided");
  const services = escapeHtml(data.services || "Not specified");
  const budget = escapeHtml(data.budget || "Not provided");
  const dateTime = escapeHtml(submittedAt);
  const message = escapeHtml(data.message).replace(/\n/g, "<br>");

  return `
    <div style="margin:0;background:#f4f6f8;padding:32px 16px;font-family:Arial,sans-serif;color:#0a0c14">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e6eaef;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#f97316 0%,#fb923c 50%,#fbbf24 100%);padding:28px 32px;color:#ffffff">
          <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Fiza Web Studio</p>
          <h1 style="margin:0;font-size:26px;line-height:1.25">New Form Submission</h1>
        </div>
        <div style="padding:32px">
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6">A visitor submitted the contact form on your website.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:12px 0;border-bottom:1px solid #e6eaef;color:#5e6e83;width:38%">Name</td><td style="padding:12px 0;border-bottom:1px solid #e6eaef;font-weight:bold">${name}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #e6eaef;color:#5e6e83">Email</td><td style="padding:12px 0;border-bottom:1px solid #e6eaef"><a href="mailto:${email}" style="color:#ea580c">${email}</a></td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #e6eaef;color:#5e6e83">Phone</td><td style="padding:12px 0;border-bottom:1px solid #e6eaef">${phone}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #e6eaef;color:#5e6e83">Services Interested In</td><td style="padding:12px 0;border-bottom:1px solid #e6eaef">${services}</td></tr>
            <tr><td style="padding:12px 0;border-bottom:1px solid #e6eaef;color:#5e6e83">Budget</td><td style="padding:12px 0;border-bottom:1px solid #e6eaef">${budget}</td></tr>
            <tr><td style="padding:12px 0;color:#5e6e83">Submitted</td><td style="padding:12px 0">${dateTime}</td></tr>
          </table>
          <div style="margin-top:28px;padding:20px;background:#fff7ed;border-left:4px solid #f97316;border-radius:8px">
            <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#c2410c">Message</p>
            <p style="margin:0;font-size:15px;line-height:1.7;white-space:normal">${message}</p>
          </div>
          <p style="margin:28px 0 0;font-size:13px;color:#7d8b9e">Reply directly to this email to contact ${name}.</p>
        </div>
      </div>
    </div>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: ContactFormData = await req.json();

    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const gmailUser = Deno.env.get("GMAIL_USER") || recipientEmail;
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailPass) {
      console.error("GMAIL_APP_PASSWORD secret not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const submittedAt = new Date().toISOString();
    const subjectName = data.name.replace(/[\r\n]+/g, " ").slice(0, 120);
    const subject = `New Form Submission - ${subjectName}`;
    const emailBody = [
      "New form submission from Fiza Web Studio:",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not provided"}`,
      `Services Interested In: ${data.services || "Not specified"}`,
      `Budget: ${data.budget || "Not provided"}`,
      `Submitted: ${submittedAt}`,
      "",
      "Message:",
      data.message,
    ].join("\n");

    const client = new SmtpClient();

    await client.connect({
      hostname: "smtp.gmail.com",
      port: 465,
      username: gmailUser,
      password: gmailPass,
      ssl: true,
    });

    await client.send({
      from: gmailUser,
      to: recipientEmail,
      subject,
      content: emailBody,
      html: createEmailTemplate(data, submittedAt),
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error sending email:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
