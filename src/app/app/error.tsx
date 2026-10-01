"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { PageShell } from "@/components/app/page-shell";
import { Button, Card, EmptyState, buttonClasses } from "@/components/ui/primitives";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageShell>
      <Card>
        <EmptyState
          icon={<TriangleAlert size={20} />}
          title="Company information couldn't be completed."
          description="We could not verify enough permitted public evidence for this request. Nothing was published to the profile."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={reset}>
                Try again
              </Button>
              <Link href="/app/sources" className={buttonClasses("ghost", "sm")}>
                View available evidence
              </Link>
            </div>
          }
        />
      </Card>
    </PageShell>
  );
}
