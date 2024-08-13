import { DomainForm } from "@/components/domain-form";
import SearchCards from "@/components/search-cards";
import { getSearches } from "@/server/search";

export default async function HomePage() {
  const searches = await getSearches();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold">Find your ideal domain</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Describe the domain you are looking for and we will find the best
          options for you.
        </p>
        <DomainForm />

        {searches.length > 0 && (
          <>
            <h2 className="mb-4 mt-12 text-2xl font-semibold">
              Your Recent Searches
            </h2>
            <SearchCards searches={searches} />
          </>
        )}
      </main>
    </div>
  );
}
