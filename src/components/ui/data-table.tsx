"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./primitives";

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  width?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
  hideOn?: "sm" | "md";
};

export function DataTable<T>({
  columns,
  rows,
  getKey,
  onRowClick,
  loading,
  empty,
  mobileCard,
  dense,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  empty?: ReactNode;
  mobileCard?: (row: T) => ReactNode;
  dense?: boolean;
  className?: string;
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      const result = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? result : -result;
    });
    return copy;
  }, [rows, sort, columns]);

  if (loading) {
    return (
      <div className={cn("divide-y divide-[var(--sp-border)]", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!rows.length) return <>{empty}</>;

  return (
    <div className={className}>
      {/* Mobile cards */}
      {mobileCard ? (
        <ul className="divide-y divide-[var(--sp-border)] md:hidden">
          {sorted.map((row) => (
            <li key={getKey(row)}>
              <button
                type="button"
                onClick={() => onRowClick?.(row)}
                className="w-full px-4 py-3.5 text-left transition-colors duration-150 hover:bg-[var(--sp-surface-2)]"
              >
                {mobileCard(row)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={cn("sp-scroll overflow-x-auto", mobileCard && "hidden md:block")}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--sp-border)]">
              {columns.map((column) => {
                const active = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    className={cn(
                      "bg-[var(--sp-surface-2)]/45 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-text-subtle)]",
                      column.align === "right" && "text-right",
                      column.hideOn === "sm" && "hidden lg:table-cell",
                      column.hideOn === "md" && "hidden xl:table-cell",
                    )}
                  >
                    {column.sortable && column.sortValue ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSort((prev) =>
                            prev?.key === column.key
                              ? { key: column.key, dir: prev.dir === "asc" ? "desc" : "asc" }
                              : { key: column.key, dir: "asc" },
                          )
                        }
                        className={cn(
                          "inline-flex items-center gap-1 rounded transition-colors duration-150 hover:text-[var(--sp-text)]",
                          active && "text-[var(--sp-text)]",
                          column.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {column.header}
                        {active ? (
                          sort?.dir === "asc" ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )
                        ) : (
                          <ChevronDown size={12} className="opacity-25" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={getKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "group/row relative border-b border-[var(--sp-border-soft)] transition-colors duration-150 last:border-b-0",
                  onRowClick &&
                    "cursor-pointer hover:bg-[var(--sp-surface-2)]/70 focus-visible:bg-[var(--sp-surface-2)]/70",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "relative px-4 align-middle text-[13px] text-[var(--sp-text)]",
                      "first:before:absolute first:before:inset-y-0 first:before:left-0 first:before:w-[2px] first:before:origin-top first:before:scale-y-0 first:before:bg-[var(--sp-accent)] first:before:transition-transform first:before:duration-200 group-hover/row:first:before:scale-y-100",
                      dense ? "py-2.5" : "py-3.5",
                      column.align === "right" && "text-right",
                      column.hideOn === "sm" && "hidden lg:table-cell",
                      column.hideOn === "md" && "hidden xl:table-cell",
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
