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
  message: string;
}

class SmtpConnection {
  private readonly connection: Deno.Conn;
  private buffer = "";

  constructor(connection: Deno.Conn) {
    this.connection = connection;
  }

  async send(command: string): Promise<void> {
    await this.connection.write(new TextEncoder().encode(`${command}\r\n`));
  }

  async readResponse(): Promise<void> {
    const chunk = new Uint8Array(2048);

    while (true) {
      const lineEnd = this.buffer.indexOf("\r\n");
      if (lineEnd >= 0) {
        const line = this.buffer.slice(0, lineEnd);
        this.buffer = this.buffer.slice(lineEnd + 2);
        if (/^\d{3} /.test(line)) {
          const code = Number(line.slice(0, 3));
          if (code >= 400) throw new Error(`SMTP error ${code}`);
          return;
        }
        continue;
      }

      const bytesRead = await this.connection.read(chunk);
      if (bytesRead === null) throw new Error("SMTP connection closed unexpectedly");
      this.buffer += new TextDecoder().decode(chunk.subarray(0, bytesRead));
    }
  }

  async close(): Promise<void> {
    this.connection.close();
  }
}

function cleanHeader(value: string): string {
  return value.replace(/[\r\n]/g, " ").trim();
}

function encodeBase64(value: string): string {
  return btoa(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail(data: ContactFormData, username: string, password: string): Promise<void> {
  const connection = await Deno.connectTls({ hostname: "smtp.gmail.com", port: 465 });
  const smtp = new SmtpConnection(connection);

  try {
    await smtp.readResponse();
    await smtp.send("EHLO portfolio.local");
    await smtp.readResponse();
    await smtp.send("AUTH LOGIN");
    await smtp.readResponse();
    await smtp.send(encodeBase64(username));
    await smtp.readResponse();
    await smtp.send(encodeBase64(password));
    await smtp.readResponse();
    await smtp.send(`MAIL FROM:<${cleanHeader(username)}>`);
    await smtp.readResponse();
    await smtp.send("RCPT TO:<fizawebstudio@gmail.com>");
    await smtp.readResponse();
    await smtp.send("DATA");
    await smtp.readResponse();

    const subject = "New Project Inquiry | Fiza Web Studio";
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safePhone = escapeHtml(data.phone || "Not provided");
    const safeServices = escapeHtml(data.services || "Not specified");
    const safeMessage = escapeHtml(data.message).replace(/\r?\n/g, "<br>");
    const textBody = [
      "New project inquiry for Fiza Web Studio",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not provided"}`,
      `Services: ${data.services || "Not specified"}`,
      "",
      "Message:",
      data.message,
    ].join("\r\n").replace(/^\./gm, "..");
    const htmlBody = `<!doctype html>
<html>
  <body style="margin:0;background:#fffaf5;font-family:Arial,Helvetica,sans-serif;color:#29231f;">
    <div style="padding:32px 16px;background:#fffaf5;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #f5eee8;border-radius:18px;overflow:hidden;">
        <div style="padding:28px 32px;background:#171311;color:#ffffff;border-bottom:5px solid #f97316;">
          <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#fdba74;font-weight:bold;">Fiza Web Studio</div>
          <h1 style="margin:12px 0 0;font-size:26px;line-height:1.2;">New project inquiry</h1>
          <p style="margin:10px 0 0;color:#e7ddd4;font-size:14px;line-height:1.6;">A new message has arrived through your website.</p>
        </div>
        <div style="padding:28px 32px;">
          <div style="margin-bottom:22px;padding:16px 18px;background:#fff7ed;border-left:4px solid #f97316;border-radius:8px;">
            <div style="font-size:12px;color:#91847a;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">From</div>
            <div style="margin-top:6px;font-size:18px;font-weight:bold;color:#171311;">${safeName}</div>
            <a href="mailto:${safeEmail}" style="display:inline-block;margin-top:4px;color:#ea580c;font-size:14px;text-decoration:none;">${safeEmail}</a>
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:10px 0;color:#91847a;width:38%;border-bottom:1px solid #f5eee8;">Phone</td><td style="padding:10px 0;font-weight:bold;border-bottom:1px solid #f5eee8;">${safePhone}</td></tr>
            <tr><td style="padding:10px 0;color:#91847a;border-bottom:1px solid #f5eee8;">Service</td><td style="padding:10px 0;font-weight:bold;border-bottom:1px solid #f5eee8;">${safeServices}</td></tr>
          </table>
          <div style="margin-top:24px;">
            <div style="font-size:12px;color:#91847a;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Message</div>
            <div style="margin-top:10px;padding:16px;background:#fffaf5;border-radius:10px;font-size:15px;line-height:1.7;">${safeMessage}</div>
          </div>
          <a href="mailto:${safeEmail}" style="display:inline-block;margin-top:26px;padding:13px 20px;background:#f97316;color:#ffffff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;">Reply to inquiry</a>
        </div>
        <div style="padding:18px 32px;background:#fff7ed;color:#91847a;font-size:12px;line-height:1.5;">This message was sent from the Fiza Web Studio contact form.</div>
      </div>
    </div>
  </body>
</html>`.replace(/^\./gm, "..");
    const boundary = "fiza-web-studio-boundary";
    const message = [
      `From: Fiza Web Studio <${cleanHeader(username)}>`,
      "To: fizawebstudio@gmail.com",
      `Reply-To: ${cleanHeader(data.email)}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary=\"${boundary}\"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      textBody,
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      htmlBody,
      "",
      `--${boundary}--`,
      ".",
    ].join("\r\n");

    await connection.write(new TextEncoder().encode(`${message}\r\n`));
    await smtp.readResponse();
    await smtp.send("QUIT");
    await smtp.readResponse();
  } finally {
    await smtp.close();
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: ContactFormData = await req.json();
    const name = data.name?.trim();
    const email = data.email?.trim();
    const message = data.message?.trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailPassword) {
      return new Response(
        JSON.stringify({ error: "Email service is not ready" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    await sendEmail({ ...data, name, email, message }, gmailUser, gmailPassword);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ error: "Unable to send message" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
