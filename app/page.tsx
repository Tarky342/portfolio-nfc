import { getGalleryPanels, HUD } from "@/components/portfolio/data";
import PortfolioShell from "@/components/portfolio/portfolio-shell";

export default async function HomePage() {
  const panels = await getGalleryPanels();

  return <PortfolioShell panels={panels} hud={HUD} />;
}
