import DomainPoller from "@/components/domain-poller";
import { getDomains } from "@/server/domains";

export default async function SearchPage({
  params,
}: {
  params: { searchId: string };
}) {
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
      <DomainPoller
        searchId={params.searchId}
        initialSearching={searching}
        initialDomains={initialDomains}
      />
    </div>
  );
}
