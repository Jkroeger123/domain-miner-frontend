import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const competition = searchParams.get("competition");
  const highBid = searchParams.get("highBid");
  const lowBid = searchParams.get("lowBid");
  const searchVolume = searchParams.get("searchVolume");

  if (!name) {
    return new Response("Missing name parameter", { status: 400 });
  }

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
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              CPC: ${lowBid ?? "?"} - ${highBid ?? "?"}
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              Search Volume: {searchVolume ?? "?"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            Competition: {competition === "UNSPECIFIED" ? "?" : competition}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
