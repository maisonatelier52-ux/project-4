import Business from "@/components/business";
import Finance from "@/components/finance";
import World from "@/components/world";
import US from "@/components/us";
import Sports from "@/components/sports";
import Lifestyle from "@/components/lifestyle";

export default function HomePage() {
  return (
    <main>
      <Business />
      <Finance />
      <World />
      <US />
      <Lifestyle />
      <Sports />
    </main>
  );
}