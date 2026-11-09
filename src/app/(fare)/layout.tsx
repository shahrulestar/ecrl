import { FareShell } from "@/components/fare/fare-shell";

export default function FareLayout({ children }: { children: React.ReactNode }) {
  return <FareShell>{children}</FareShell>;
}
