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
  hint: "公開できるようなプロジェクトもないので今回私のネットワークを公開\nScroll to nexplore",
};

const defaultSplashImage = "/NameCard/cardFront.svg";
const networkImages = [
  "/networkIMG/backup.png",
  "/networkIMG/network.png",
  "/networkIMG/Overview.png",
  "/networkIMG/VPNNetwork.png",
];

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
    title: "バックアップ図",
    tag: "Backup",
    short: "vzdump からローカル保存し、rclone で Google Drive に同期。",
    description:
      "vzdump からローカルダンプ領域へ保存し、rclone で暗号化アップロードするバックアップ経路の全体像。",
    chips: ["backup", "vzdump", "rclone", "gdrive"],
    cta: [{ label: "Open", href: "#", primary: true }],
    image: networkImages[0],
  },
  {
    id: "fallback-2",
    title: "概要図",
    tag: "Home Network",
    short: "Proxmox と vm-front/vm-web、iRMC の配置概要。",
    description:
      "ONU/ルーターと L2 スイッチ配下に Proxmox ホストと iRMC を配置し、vm-front から vm-web へ proxy_pass。",
    chips: ["home", "proxmox", "vm", "nginx"],
    cta: [
      { label: "Open", href: "#", primary: true },
      { label: "Contact", href: "#contact" },
    ],
    image: networkImages[1],
  },
  {
    id: "fallback-3",
    title: "全体図",
    tag: "System Overview",
    short: "Cloudflare と VPN を含む全体アーキテクチャ。",
    description:
      "Cloudflare 経由の HTTPS 公開、NetBird VPN の管理経路、Proxmox 上の vm-front/vm-web、iRMC、バックアップ連携までを包含。",
    chips: ["cloudflare", "netbird", "proxmox", "overview"],
    cta: [{ label: "Open", href: "#", primary: true }],
    image: networkImages[2],
  },
  {
    id: "fallback-4",
    title: "ネットワーク図",
    tag: "VPN Access",
    short: "NetBird VPN による管理アクセスの流れ。",
    description:
      "Remote Admin PC から VPN トンネルで PVE と iRMC にアクセスし、ローカル管理 PC は HTTPS/SSH/WebUI で各 VM を操作。",
    chips: ["vpn", "netbird", "admin", "access"],
    cta: [{ label: "Open", href: "#", primary: true }],
    image: networkImages[3],
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

function mapPanel(panel: SanityPanel, index: number): GalleryPanel {
  const project = panel.project;
  const title = panel.title ?? project?.title ?? "Untitled";
  const tag = project?.tag ?? project?.title ?? title;
  const short = panel.short ?? project?.summary ?? project?.description ?? "";
  const description = project?.description ?? project?.summary ?? short;
  const chips = project?.tags ?? [];
  const imageSource = panel.image ?? project?.heroImage;
  const localImage = networkImages[index % networkImages.length];
  const image = localImage
    ? localImage
    : imageSource
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

    return panels.map((panel, index) => mapPanel(panel, index));
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
