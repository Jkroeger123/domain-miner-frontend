import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { getDomain } from "@/server/domains";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domainId = searchParams.get("domainId");

  if (!domainId) {
    return new Response("Missing domainId parameter", { status: 400 });
  }

  const domain = await getDomain(domainId);

  if (!domain.data) {
    return new Response("Domain not found", { status: 404 });
  }

  const { name, competition, highBid, lowBid, searchVolume } = domain.data;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 24 }}>{name}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            marginBottom: 16,
          }}
        >
          <div>
            CPC: ${lowBid?.toFixed(2) ?? "?"} - ${highBid?.toFixed(2) ?? "?"}
          </div>
          <div>Volume: {searchVolume ?? "?"}</div>
        </div>
        <div>
          Competition: {competition === "UNSPECIFIED" ? "?" : competition}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
