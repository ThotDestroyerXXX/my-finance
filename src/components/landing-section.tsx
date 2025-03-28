import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function LandingSection() {
  return (
    <section className="flex min-h-full flex-col items-center justify-center gap-5 sm:gap-10">
      <div className="flex w-full flex-col gap-6 px-4 text-4xl font-bold max-md:gap-0 md:text-5xl lg:text-6xl">
        <h1>Manage Finance From</h1>
        <h1>Anywhere, Anytime</h1>
      </div>
      <div>
        <Button
          variant={"outline"}
          className="p-4 sm:p-6 sm:text-sm md:text-base lg:text-lg"
        >
          <ArrowRight />
          Get Started
        </Button>
      </div>
    </section>
  );
}
