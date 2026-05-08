import {
  getGalleryPanels,
  getSplashImageUrl,
  HUD,
} from "@/components/portfolio/data";
import PortfolioShell from "@/components/portfolio/portfolio-shell";

export default async function HomePage() {
  const panels = await getGalleryPanels();
  const splashImageUrl = await getSplashImageUrl();

  return (
    <PortfolioShell panels={panels} hud={HUD} splashImageUrl={splashImageUrl} />
  );
}
