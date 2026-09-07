import Business from "@/components/business";
import Finance from "@/components/finance";
import World from "@/components/world";
import US from "@/components/us";
import Sports from "@/components/sports";
import Politics from "@/components/politics";

export default function HomePage() {
  return (
    <main>
      <Business />
      <Finance />
      <World />
      <US />
      <Politics />
      <Sports />
    </main>
  );
}