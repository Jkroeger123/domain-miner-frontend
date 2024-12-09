import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { BookmarkIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookmarkedDomains, toggleBookmark } from "@/server/bookmark";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function BookmarksPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

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
              <Card className="h-full border-gray-200 bg-white transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between">
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
                        <span className="sr-only">Remove bookmark</span>
                      </Button>
                    </form>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm">
                    {domain.searchVolume && (
                      <span className="text-blue-600">
                        Monthly Searches: {domain.searchVolume.toLocaleString()}
                      </span>
                    )}
                    {domain.competition &&
                      domain.competition !== "UNSPECIFIED" && (
                        <span className="text-amber-600">
                          Competition: {domain.competition}
                        </span>
                      )}
                  </div>

                  {(domain.highBid ?? domain.lowBid) && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      {domain.highBid && (
                        <span>High Bid: ${domain.highBid.toFixed(2)}</span>
                      )}
                      {domain.lowBid && (
                        <span>Low Bid: ${domain.lowBid.toFixed(2)}</span>
                      )}
                    </div>
                  )}

                  <p className="mt-3 text-xs text-muted-foreground">
                    Bookmarked on {new Date(createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}