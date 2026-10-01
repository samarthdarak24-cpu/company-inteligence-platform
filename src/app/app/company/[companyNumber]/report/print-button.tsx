"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/primitives";

export function PrintButton() {
  return (
    <Button variant="primary" size="sm" onClick={() => window.print()}>
      <Printer size={14} />
      Print / PDF
    </Button>
  );
}
