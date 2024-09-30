import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDomain } from "@/server/domains";
import { notFound } from "next/navigation";

export default async function SearchPage({
  params,
}: {
  params: { domainId: string };
}) {
  const domain = await getDomain(params.domainId);
  if (!domain.data) {
    return notFound();
  }
  const { name, competition, highBid, lowBid, searchVolume } = domain.data;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">{name}</h1>
      <main className="grid flex-1 gap-6 p-6 md:grid-cols-2 md:p-10 lg:grid-cols-3">
        <Card className="bg-card p-6 text-card-foreground">
          <CardHeader>
            <CardTitle>Average CPC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              ${lowBid?.toFixed(2) ?? "?"} - ${highBid?.toFixed(2) ?? "?"}
            </div>
            <p className="text-muted-foreground">
              Average cost-per-click top and bottom range for ads on this domain
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card p-6 text-card-foreground">
          <CardHeader>
            <CardTitle>Monthly Search Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{searchVolume ?? "?"}</div>
            <p className="text-muted-foreground">
              Average monthly searches keywords related to this domain
            </p>
          </CardContent>
        </Card>
        {/* <Card className="bg-card p-6 text-card-foreground"> // TODO: Add this back in when we have sale data
          <CardHeader>
            <CardTitle>Previous Sale Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span>SodaWorld.com</span>
                <span className="font-bold">$4,511</span>
              </div>
              <div className="flex justify-between">
                <span>StrawberrySoda.com</span>
                <span className="font-bold">$9,644</span>
              </div>
              <div className="flex justify-between">
                <span>SuperiorSoda.com</span>
                <span className="font-bold">$300</span>
              </div>
            </div>
            <p className="mt-2 text-muted-foreground">
              Prices of similar domains sold recently
            </p>
          </CardContent>
        </Card> */}
        <Card className="bg-card p-6 text-card-foreground">
          <CardHeader>
            <CardTitle>Domain Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-4xl font-bold">
                  {competition === "UNSPECIFIED" ? "?" : competition}
                </div>
                <p className="text-muted-foreground">Competition</p>
              </div>
              <div>
                <div className="text-4xl font-bold">
                  $
                  {highBid !== null && lowBid !== null
                    ? ((highBid + lowBid) / 2).toFixed(2)
                    : "?"}
                </div>
                <p className="text-muted-foreground">Avg. CPC</p>
              </div>
              {/* <div> // TODO: Add this back in when we have estimated value data
                <div className="text-4xl font-bold">$137</div>
                <p className="text-muted-foreground">Estimated Value</p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
