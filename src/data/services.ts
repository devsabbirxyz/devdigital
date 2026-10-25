import { services as rawServices } from "./services.js";

export type ServiceProcessStep = {
  step: string;
  text: string;
};

export type ServiceStat = {
  value: number;
  suffix: string;
  label: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
};

export type ServiceCta = {
  label: string;
  href: string;
};

export type ServiceDetails = {
  valueLine: string;
  overview: string[];
  deliverables: string[];
  process: ServiceProcessStep[];
  tools: string[];
  stats: ServiceStat[];
  timeline: string;
  faq: ServiceFaq[];
  cta: ServiceCta;
};

export type ServiceItem = {
  id: string;
  number: number;
  title: string;
  short: string;
  image: string;
  details: ServiceDetails;
};

export type ServiceSection = {
  id: string;
  index: string;
  introTitle: string;
  heading: string;
  subheading: string;
  accent: "pink" | "teal" | string;
  items: ServiceItem[];
};

export const services: ServiceSection[] = rawServices as ServiceSection[];
