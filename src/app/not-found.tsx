import Link from "next/link";
import { ArrowLeft, Search, Compass } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-105 w-105 rounded-full bg-electric-500/20 blur-[130px]" />
      <Container className="relative py-24 text-center">
        <p className="font-mono text-7xl font-extrabold tracking-tight text-white/10 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          This route doesn't exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-navy-200">
          The page you're looking for has moved, or was never on our network. Let's get you
          back on a working route.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/tracking">
              <Search className="h-4 w-4" />
              Track a shipment
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost-light">
            <Link href="/services">
              <Compass className="h-4 w-4" />
              Explore services
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
