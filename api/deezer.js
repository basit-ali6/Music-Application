export async function GET(request) {
    const url = new URL(request.url);

    const query = url.searchParams.get("q") || "";
    const index = url.searchParams.get("index") || "0";
    const limit = url.searchParams.get("limit") || "25";

    const response = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(query)}&index=${index}&limit=${limit}`
    );

    if (!response.ok) {
        return Response.json(
            { error: "Deezer request failed" },
            { status: response.status }
        );
    }

    const data = await response.json();

    return Response.json(data);
}