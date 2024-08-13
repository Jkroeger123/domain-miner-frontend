import DomainPoller from "@/components/domain-poller";
import { getDomains } from "@/server/domains";
import { getSearch } from "@/server/search";
import { notFound } from "next/navigation";

export default async function SearchPage({
  params,
}: {
  params: { searchId: string };
}) {
  const search = await getSearch(params.searchId);

  if (!search) {
    return notFound();
  }

  const {
    domains: initialDomains,
    searching,
    error,
  } = await getDomains(params.searchId);

  if (error) {
    return <div>Error loading domains: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
      <p className="italic">{`"${search.prompt}"`}</p>
      <DomainPoller
        searchId={params.searchId}
        initialSearching={searching}
        initialDomains={initialDomains}
      />
    </div>
  );
}
