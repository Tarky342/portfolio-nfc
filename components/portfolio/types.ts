export type GalleryPanelCta = {
  label: string;
  href: string;
  primary?: boolean;
};

export type GalleryPanel = {
  id: string;
  title: string;
  tag: string;
  short: string;
  description: string;
  chips: string[];
  cta: GalleryPanelCta[];
  image: string;
};

export type GalleryHud = {
  name: string;
  subtitle: string;
  hint: string;
};
