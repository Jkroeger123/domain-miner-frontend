import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SearchPage({
  params,
}: {
  params: { searchId: string };
}) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">SodaSurge.com</h1>
      <main className="grid flex-1 gap-6 p-6 md:grid-cols-2 md:p-10 lg:grid-cols-3">
        <Card className="bg-card p-6 text-card-foreground">
          <CardHeader>
            <CardTitle>Average CPC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$0.33 - $6.20</div>
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
            <div className="text-4xl font-bold">10k - 100k</div>
            <p className="text-muted-foreground">
              Average monthly searches keywords related to this domain
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card p-6 text-card-foreground">
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
        </Card>
        <Card className="col-span-1 bg-card p-6 text-card-foreground lg:col-span-2">
          <CardHeader>
            <CardTitle>Domain Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div>
                <div className="text-4xl font-bold">Low</div>
                <p className="text-muted-foreground">Competition</p>
              </div>
              <div>
                <div className="text-4xl font-bold">$3.27</div>
                <p className="text-muted-foreground">Avg. CPC</p>
              </div>
              <div>
                <div className="text-4xl font-bold">$137</div>
                <p className="text-muted-foreground">Estimated Value</p>
              </div>
              {/* <div>
                <div className="text-4xl font-bold">10,000</div>
                <p className="text-muted-foreground">Monthly Searches</p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
