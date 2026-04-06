import { resolveDomain } from "@/lib/sns";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return Response.json({ error: "Missing domain parameter" }, { status: 400 });
  }

  const address = await resolveDomain(domain);

  if (!address) {
    return Response.json({ error: "Domain not found or could not be resolved" }, { status: 404 });
  }

  return Response.json({ address });
}
