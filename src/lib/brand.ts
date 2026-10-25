/**
 * Rfox brand facts — taken from the Kumar Clothing / Rfox reference page.
 * Update `whatsappNumber` with the shop's E.164 number (e.g. "919876543210")
 * and every WhatsApp button on the site will deep-link straight to the team.
 * Left empty, buttons open WhatsApp with the message pre-filled so the buyer
 * can pick the Rfox chat from their own contact list.
 */
export const brand = {
  name: "Rfox",
  parent: "Kumar Clothing",
  since: "2009",
  city: "Ahmedabad",
  address:
    "Block-D, Sharanam Smart Space, Ambica Society, Amraiwadi, Ahmedabad, Gujarat 380021",
  email: "rfoxjeans@gmail.com",
  instagram: "https://www.instagram.com/rfox_jeans",
  instagramHandle: "@rfox_jeans",
  facebook: "https://www.facebook.com/rfoxjeans",
  facebookHandle: "/rfoxjeans",
  whatsappNumber: "",
  freeShippingAbove: 2499,
  shippingFee: 99,
  returnDays: 14,
} as const;

export function whatsappLink(message: string) {
  const base = brand.whatsappNumber ? `https://wa.me/${brand.whatsappNumber}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body = "") {
  return `mailto:${brand.email}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ""
  }`;
}
