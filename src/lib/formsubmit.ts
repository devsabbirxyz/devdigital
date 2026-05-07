const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/developersabbir.x@gmail.com";

export async function sendFormsubmit(payload: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  plan?: string | null;
}) {
  try {
    await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        Name: payload.name,
        Email: payload.email,
        Phone: payload.phone || "",
        Message: payload.message,
        Plan: payload.plan || "",
        _subject: "New Contact Form Submission - Portfolio",
        _captcha: "false",
        _template: "table",
      }),
    });
  } catch (e) {
    console.warn("Formsubmit failed", e);
  }
}

export const FORMSUBMIT_NOTIFY_EMAIL = "developersabbir.x@gmail.com";