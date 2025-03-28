import ImageTransitionSection from "@/components/image-transition-section";
import LandingSection from "@/components/landing-section";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center gap-15 pt-20 pb-20 text-center">
      <LandingSection />
      <ImageTransitionSection />
    </main>
  );
}
