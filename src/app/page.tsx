import { DomainFinder } from "@/components/domain-finder";
import SearchCards from "@/components/search-cards";
import { getSearches } from "@/server/search";
import { SignedIn } from "@clerk/nextjs";

export default async function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-50">
      <main className="container flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold">Find your ideal domain</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Describe the domain you are looking for and we will find the best
          options for you.
        </p>

        <DomainFinder />

        <SignedIn>
          <Searches />
        </SignedIn>
      </main>
    </div>
  );
}

async function Searches() {
  const searches = await getSearches();

  if (searches.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="mt-12 text-2xl font-semibold">Your Recent Searches</h2>
      <SearchCards searches={searches} />
    </>
  );
}
