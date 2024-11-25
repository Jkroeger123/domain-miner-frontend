"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookmarksLink() {
  const pathname = usePathname();
  const isActive = pathname === "/bookmarks";

  return (
    <Link
      href="/bookmarks"
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors",
        isActive ? "text-foreground" : "hover:bg-muted",
      )}
    >
      <BookmarkIcon size={16} />
      <span>Bookmarks</span>
    </Link>
  );
}
