import Business from "@/components/business";
import Politics from "../components/politics";
import Technology from "@/components/technology";
import Health from "@/components/health";
import Sports from "@/components/sports";
import Lifestyle from "@/components/lifestyle";

export default function HomePage() {
  return (
    <main>
      <Business />
      <Politics />
      <Technology />
      <Health />
      <Lifestyle />
      <Sports />
    </main>
  );
}