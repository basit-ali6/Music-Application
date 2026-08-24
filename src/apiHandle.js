export async function getData(query, index = 0) {
    const response = await fetch(
        `/api/deezer?q=${encodeURIComponent(query)}&index=${index}&limit=25`
    );

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return data.data;
}

export async function getSearchPage(query, page = 1) {
    const limit = 12;
    const index = (page - 1) * limit;

    const response = await fetch(
        `/api/deezer?q=${encodeURIComponent(query)}&index=${index}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return {
        songs: data.data,
        total: data.total
    };
}