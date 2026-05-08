import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const KIND_LABELS: Record<string, string> = {
  teledysk: "Teledysk",
  "promo-video": "Wideo promocyjne",
  "photo-session": "Sesja zdjęciowa",
  montaz: "Montaż",
  other: "Inny epicki pomysł",
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Serwer nie jest skonfigurowany do wysyłki." },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const formData = await request.formData();

    const fax = (formData.get("fax") as string) || "";
    if (fax.trim()) {
      return NextResponse.json({ success: true, message: "OK" });
    }

    const projectKind = (formData.get("projectKind") as string) || "";
    const referenceUrl = ((formData.get("referenceUrl") as string) || "").trim();
    const story = ((formData.get("story") as string) || "").trim();
    const name = ((formData.get("name") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim();

    if (!projectKind || !KIND_LABELS[projectKind]) {
      return NextResponse.json(
        { error: "Nieprawidłowy typ projektu." },
        { status: 400 },
      );
    }

    if (story.length < 8) {
      return NextResponse.json(
        { error: "Opis projektu jest za krótki." },
        { status: 400 },
      );
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Podaj imię." }, { status: 400 });
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      return NextResponse.json(
        { error: "Podaj poprawny numer telefonu." },
        { status: 400 },
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Niepoprawny format adresu e-mail." },
        { status: 400 },
      );
    }

    let validatedRefUrl = "";
    if (referenceUrl) {
      try {
        const raw = referenceUrl.match(/^https?:\/\//)
          ? referenceUrl
          : `https://${referenceUrl}`;
        validatedRefUrl = new URL(raw).toString();
      } catch {
        return NextResponse.json(
          { error: "Link referencyjny ma niepoprawny format." },
          { status: 400 },
        );
      }
    }

    const kindLabel = KIND_LABELS[projectKind] ?? projectKind;
    const adminEmail =
      process.env.PROJECT_BRIEF_EMAIL_TO ||
      process.env.QUOTE_EMAIL_TO ||
      process.env.CONTACT_EMAIL_TO;

    if (!adminEmail) {
      console.error("No recipient email env (PROJECT_BRIEF_EMAIL_TO / …)");
      return NextResponse.json(
        { error: "Brak adresu odbiorcy po stronie serwera." },
        { status: 500 },
      );
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Aest Media <brief@resend.dev>";

    const safe = {
      kindLabel: escapeHtml(kindLabel),
      story: escapeHtml(story),
      name: escapeHtml(name),
      phone: escapeHtml(phone),
      email: escapeHtml(email || "Nie podano"),
    };

    const referenceCell = validatedRefUrl
      ? `<a href="${escapeHtml(validatedRefUrl)}">${escapeHtml(referenceUrl)}</a>`
      : "—";

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; color: #18181b; }
    .wrap { max-width: 600px; margin: 0 auto; padding: 20px; }
    .head {
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: #fafafa;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .body {
      background: #f4f4f5;
      padding: 20px;
      border: 1px solid #e4e4e7;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #d4d4d8; }
    th { width: 32%; color: #52525b; font-weight: 600; }
    .block { margin-top: 16px; padding: 14px; background: #fff; border-radius: 8px; border-left: 4px solid #e11d48; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1 style="margin:0;font-size:22px;">Nowy brief — Aest Media</h1>
    </div>
    <div class="body">
      <table>
        <tr><th>Typ</th><td>${safe.kindLabel}</td></tr>
        <tr><th>Link / referencja</th><td>${referenceCell}</td></tr>
        <tr><th>Imię</th><td>${safe.name}</td></tr>
        <tr><th>Telefon</th><td>${safe.phone}</td></tr>
        <tr><th>E-mail</th><td>${safe.email}</td></tr>
      </table>
      <div class="block">
        <strong>Opis / klimat</strong>
        <p style="margin:8px 0 0;white-space:pre-wrap;">${safe.story}</p>
      </div>
      <p style="font-size:12px;color:#71717a;margin-top:20px;">Wiadomość z formularza kinowego konfiguratora na stronie Aest Media.</p>
    </div>
  </div>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `Brief: ${kindLabel} — ${name}`,
      html: emailHtml,
      ...(email && email !== adminEmail ? { replyTo: email } : {}),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || "Błąd wysyłki" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("send-project-brief:", e);
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości." },
      { status: 500 },
    );
  }
}
