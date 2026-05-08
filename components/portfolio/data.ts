import "server-only";

import type {
    GalleryHud,
    GalleryPanel,
    GalleryPanelCta,
} from "@/components/portfolio/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import groq from "groq";

export const HUD: GalleryHud = {
  name: "Okamoto Takaaki",
  subtitle: "Information Design Lab & Programming Club",
  hint: "Scroll to\nexplore",
};

const defaultSplashImage = "/NameCard/cardFront.svg";

type SanityLink = { label?: string; url?: string; primary?: boolean };

type SanityPanel = {
  _id: string;
  title?: string;
  short?: string;
  displayOrder?: number;
  image?: unknown;
  targetType?: "project" | "external";
  externalUrl?: string;
  project?: {
    title?: string;
    tag?: string;
    summary?: string;
    description?: string;
    tags?: string[];
    heroImage?: unknown;
    links?: SanityLink[];
  } | null;
};

type SanitySplashSettings = {
  image?: unknown;
};

const panelsQuery = groq`
  *[_type == "panelpanel"] | order(displayOrder asc) {
    _id,
    title,
    short,
    displayOrder,
    image,
    targetType,
    externalUrl,
    project->{
      title,
      tag,
      summary,
      description,
      tags,
      heroImage,
      links
    }
  }
`;

const splashQuery = groq`
  *[_type == "splashSettings"][0] {
    image
  }
`;

const fallbackPanels: GalleryPanel[] = [
  {
    id: "fallback-1",
    title: "Project 01",
    tag: "Project 01 - Photography",
    short: "Highland light studies and texture experiments.",
    description:
      "A photo series focused on highland light, layered shadows, and quiet gradients.",
    chips: ["photo", "series", "2026"],
    cta: [{ label: "Open", href: "#", primary: true }],
    image:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=85",
  },
  {
    id: "fallback-2",
    title: "Project 02",
    tag: "Project 02 - Installation",
    short: "Spatial light study with soft motion cues.",
    description:
      "An installation that uses ambient motion and projection to shape space and attention.",
    chips: ["installation", "spatial", "2026"],
    cta: [
      { label: "Open", href: "#", primary: true },
      { label: "Contact", href: "#contact" },
    ],
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=85",
  },
  {
    id: "fallback-3",
    title: "Project 03",
    tag: "Project 03 - Motion",
    short: "Gentle motion language for a tactile UI.",
    description:
      "A motion system that blends physicality with soft, serif typography for calm focus.",
    chips: ["motion", "interaction", "2025"],
    cta: [{ label: "Open", href: "#", primary: true }],
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85",
  },
  {
    id: "fallback-4",
    title: "Project 04",
    tag: "Project 04 - Contact",
    short: "Contact details and collaboration notes.",
    description:
      "Let us collaborate on spatial visuals, product visuals, or editorial motion.",
    chips: ["contact", "info", "2026"],
    cta: [{ label: "Email", href: "mailto:hello@example.com", primary: true }],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=85",
  },
];

const defaultImage = fallbackPanels[0]?.image ?? "";

function mapLinks(links?: SanityLink[]): GalleryPanelCta[] {
  if (!links) return [];
  return links
    .filter((link): link is SanityLink => Boolean(link?.label && link?.url))
    .map((link) => ({
      label: link.label ?? "Open",
      href: link.url ?? "#",
      primary: link.primary ?? false,
    }));
}

function mapPanel(panel: SanityPanel): GalleryPanel {
  const project = panel.project;
  const title = panel.title ?? project?.title ?? "Untitled";
  const tag = project?.tag ?? project?.title ?? title;
  const short = panel.short ?? project?.summary ?? project?.description ?? "";
  const description = project?.description ?? project?.summary ?? short;
  const chips = project?.tags ?? [];
  const imageSource = panel.image ?? project?.heroImage;
  const image = imageSource
    ? urlFor(imageSource).width(1200).url()
    : defaultImage;

  let cta: GalleryPanelCta[] = mapLinks(project?.links);
  if (panel.targetType === "external" && panel.externalUrl) {
    cta = [{ label: "Open", href: panel.externalUrl, primary: true }];
  }

  return {
    id: panel._id,
    title,
    tag,
    short,
    description,
    chips,
    cta,
    image,
  };
}

export async function getGalleryPanels(): Promise<GalleryPanel[]> {
  try {
    const panels = await client.fetch<SanityPanel[]>(
      panelsQuery,
      {},
      {
        cache: "force-cache",
      },
    );

    if (!panels?.length) return fallbackPanels;

    return panels.map(mapPanel);
  } catch {
    return fallbackPanels;
  }
}

export async function getSplashImageUrl(): Promise<string> {
  try {
    const splash = await client.fetch<SanitySplashSettings | null>(
      splashQuery,
      {},
      {
        cache: "force-cache",
      },
    );

    if (!splash?.image) return defaultSplashImage;

    return urlFor(splash.image).width(800).url();
  } catch {
    return defaultSplashImage;
  }
}
