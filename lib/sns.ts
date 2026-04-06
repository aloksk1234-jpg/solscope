const SNS_PROXY_BASE = "https://sns-sdk-proxy.bonfida.workers.dev";

export async function resolveDomain(domain: string): Promise<string | null> {
  // Strip .sol suffix if present
  const cleanDomain = domain.toLowerCase().replace(/\.sol$/, "");

  try {
    const response = await fetch(`${SNS_PROXY_BASE}/resolve/${cleanDomain}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Bonfida proxy returns { s: "ok", result: "ADDRESS" } on success
    if (data?.s === "ok" && data?.result) {
      return data.result as string;
    }

    return null;
  } catch {
    return null;
  }
}
