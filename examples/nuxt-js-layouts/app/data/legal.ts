
export interface LegalSection {
  /** Anchor id, also used by the table of contents. */
  id: string;
  title: string;
  paragraphs?: string[];
  /** Bulleted list shown after the paragraphs. */
  items?: string[];
}

export interface LegalDocumentContent {
  title: string;
  description: string;
  /** Display date of the last revision. */
  updated: string;
  sections: LegalSection[];
}

/**
 * Template text for the terms of use and the privacy policy. It is written for the demo product and has
 * not been reviewed by a lawyer; the host project replaces it (or loads it from a CMS) before launch.
 */
const company = "Bokoui Layout";
const contact = "privacy@example.com";

export const termsContent: LegalDocumentContent = {
  title: "Terms of use",
  description: `The rules for using ${company}.`,
  updated: "1 October 2026",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of these terms",
      paragraphs: [
        `By creating an account or using ${company} you agree to these terms. If you use the service on behalf of an organization, you confirm that you may bind that organization to them.`,
        "If you do not agree, do not use the service.",
      ],
    },
    {
      id: "service",
      title: "The service",
      paragraphs: [
        `${company} gives members of healthcare organizations a shared workspace: navigation, tools and information that depend on the organization they select and the roles they hold there.`,
        "We may change, add or remove features. When a change materially reduces what you can do, we will tell you in advance where we can.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts and roles",
      paragraphs: ["You are responsible for activity under your account."],
      items: [
        "Give accurate information and keep it current.",
        "Keep your password confidential and tell us promptly if you suspect misuse.",
        "Use only the organizations and roles you have been granted. Do not try to reach data outside them.",
        "An organization administrator may add, change or remove your roles at any time.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      paragraphs: ["You agree not to:"],
      items: [
        "break the law or infringe the rights of others;",
        "upload malware or interfere with the service, its security or other users;",
        "scrape, reverse engineer or resell the service without written permission;",
        "use the service to send unsolicited or misleading messages.",
      ],
    },
    {
      id: "health-information",
      title: "Health information",
      paragraphs: [
        "Organizations decide what health information they record and who may see it. They are responsible for having a lawful basis and any required consent from the people the information concerns.",
        `${company} is a tool for managing information. It does not provide medical advice, diagnosis or treatment, and it is not a substitute for professional judgment. In an emergency, contact your local emergency services.`,
      ],
    },
    {
      id: "content",
      title: "Your content",
      paragraphs: [
        "You and your organization keep ownership of the content you add. You give us a limited licence to store, process and display it only as needed to run and improve the service for you.",
      ],
    },
    {
      id: "availability",
      title: "Availability and support",
      paragraphs: [
        "We aim for continuous availability but do not guarantee it. Planned maintenance is announced in advance when possible. Support is available through the Help page.",
      ],
    },
    {
      id: "suspension",
      title: "Suspension and termination",
      paragraphs: [
        "You may stop using the service at any time. We may suspend or end access if you breach these terms, if required by law, or to protect the service or other users. Where reasonable, we will give notice and a chance to fix the problem first.",
      ],
    },
    {
      id: "liability",
      title: "Disclaimers and liability",
      paragraphs: [
        "The service is provided as is, without warranties of any kind to the extent the law allows. To the extent the law allows, we are not liable for indirect or consequential loss, and our total liability for any claim is limited to the amount you paid us in the 12 months before it arose.",
        "Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: [
        "We may update these terms. The date at the top shows the latest revision. If a change is significant we will notify you; continuing to use the service after the change means you accept it.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [`Questions about these terms: ${contact}.`],
    },
  ],
};

export const privacyContent: LegalDocumentContent = {
  title: "Privacy policy",
  description: "What personal data we handle, why, and the choices you have.",
  updated: "1 October 2026",
  sections: [
    {
      id: "overview",
      title: "Overview",
      paragraphs: [
        `This policy explains how ${company} handles personal data. It covers the people who use the service and the visitors to its public pages.`,
        "Organizations that use the service decide what health information they record about their patients and staff. For that information the organization is the controller and we act as its processor, following its instructions. This policy covers the data we control ourselves, such as account and usage data.",
      ],
    },
    {
      id: "data-we-collect",
      title: "Data we collect",
      items: [
        "Account data: name, email address, photo, the organizations you belong to and your roles in them.",
        "Preferences: theme, text size, language and the sidebar state.",
        "Usage and device data: pages viewed, actions taken, browser type, IP address and error reports.",
        "Messages you send us, for example to support.",
      ],
    },
    {
      id: "how-we-use-it",
      title: "How we use it",
      items: [
        "To provide the service, including signing you in and showing what your roles allow.",
        "To keep the service secure, prevent abuse and fix faults.",
        "To remember your preferences between visits.",
        "To contact you about the service, such as security notices and changes to our terms.",
        "To understand how the service is used and improve it, using aggregated data where possible.",
      ],
      paragraphs: ["We do not sell personal data and we do not use it for third-party advertising."],
    },
    {
      id: "legal-bases",
      title: "Legal bases",
      paragraphs: [
        "Where the law requires a legal basis, we rely on performing our contract with you or your organization, our legitimate interest in running a secure and reliable service, compliance with legal obligations, and your consent where we ask for it.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      paragraphs: ["We use a small number of cookies and browser storage entries:"],
      items: [
        "Session cookie: keeps you signed in. Strictly necessary.",
        "Preference storage: your theme, design style, text size and language. Stored on your device.",
        "Sidebar cookie: remembers whether the sidebar is collapsed.",
      ],
    },
    {
      id: "sharing",
      title: "Who we share it with",
      paragraphs: [
        "Within the organizations you belong to, administrators can see your account details and roles. Service providers that host or support the service process data on our behalf under written agreements. We may disclose data when the law requires it or to protect people's safety, and in a merger or sale of the business with the same protections.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      paragraphs: [
        "We keep account data while your account is active and for a limited period afterwards for security and legal reasons. Logs are kept for a short, fixed period. Records that an organization holds are kept according to that organization's own retention rules.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We protect data with encryption in transit, access controls based on roles, and logging of sensitive actions. No system is perfectly secure; if a breach affects your data we will notify you and the relevant authorities as the law requires.",
      ],
    },
    {
      id: "your-rights",
      title: "Your choices and rights",
      paragraphs: ["Depending on where you live, you may have the right to:"],
      items: [
        "access the personal data we hold about you and receive a copy;",
        "correct inaccurate data or complete it;",
        "delete your data or restrict how we use it;",
        "object to certain uses, or withdraw consent you gave;",
        "complain to your local data protection authority.",
      ],
    },
    {
      id: "international",
      title: "International transfers",
      paragraphs: [
        "Data may be processed in countries other than your own. When it is, we use safeguards that the law recognizes, such as standard contractual clauses.",
      ],
    },
    {
      id: "children",
      title: "Children",
      paragraphs: [
        "The service is for professionals and their organizations and is not directed at children. A parent or guardian may be recorded in a patient's file by an organization, which is responsible for that record.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: ["We will post updates here and change the date at the top. For significant changes we will notify you directly."],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [`To use your rights or ask a question, write to ${contact}.`],
    },
  ],
};
