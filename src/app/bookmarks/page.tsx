import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { BookmarkIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookmarkedDomains, toggleBookmark } from "@/server/bookmark";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const Badge = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: string;
}) => {
  const styles = {
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    outline: "border border-gray-200 text-gray-600",
    default: "bg-gray-100 text-gray-700",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant as keyof typeof styles] || styles.default}`}
    >
      {children}
    </span>
  );
};

export default async function BookmarksPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const bookmarks = await getBookmarkedDomains(userId);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Bookmarked Domains</h1>
        <p className="text-muted-foreground">
          {bookmarks.length} {bookmarks.length === 1 ? "domain" : "domains"}{" "}
          bookmarked
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <BookmarkIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No bookmarks yet</h2>
          <p className="text-muted-foreground">
            Bookmark domains to keep track of them here
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map(({ domain, createdAt }) => (
            <div key={domain.id}>
              <Card className="h-40 bg-white">
                <CardContent className="flex h-full flex-col p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{domain.name}</h3>
                    <form
                      action={async () => {
                        "use server";
                        await toggleBookmark(domain.id);
                        revalidatePath("/bookmarks");
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </form>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Boolean(domain.searchVolume) && (
                      <Badge variant="blue">
                        Monthly Searches: {domain.searchVolume}
                      </Badge>
                    )}
                    {domain.competition &&
                      domain.competition !== "UNSPECIFIED" && (
                        <Badge variant="amber">
                          Competition: {domain.competition}
                        </Badge>
                      )}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {domain.highBid && (
                      <Badge variant="outline">
                        High Bid: ${domain.highBid.toFixed(2)}
                      </Badge>
                    )}
                    {domain.lowBid && (
                      <Badge variant="outline">
                        Low Bid: ${domain.lowBid.toFixed(2)}
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      Bookmarked on {new Date(createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
