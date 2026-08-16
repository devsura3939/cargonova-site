import {
  Truck,
  Container,
  Boxes,
  Zap,
  Snowflake,
  Warehouse,
  Network,
  Factory,
  ShoppingBag,
  HardHat,
  Car,
  Utensils,
  Package,
  HeartPulse,
  Cog,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  container: Container,
  boxes: Boxes,
  zap: Zap,
  snowflake: Snowflake,
  warehouse: Warehouse,
  network: Network,
  crane: Warehouse, // fallback mapping handled below
  factory: Factory,
  "shopping-bag": ShoppingBag,
  "hard-hat": HardHat,
  car: Car,
  utensils: Utensils,
  package: Package,
  "heart-pulse": HeartPulse,
  cog: Cog,
};

export function ServiceIcon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? Truck;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
