
export function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function isFavorite(songId) {
    const favorites = getFavorites();
    return favorites.some((song) => song.id === songId)
}

export function toggleFavorite(song) {
    let favorites = getFavorites();
    const exists = favorites.some((item) => item.id === song.id)

    if (exists) {
        favorites = favorites.filter((item) => item.id !== song.id);
    } else {
        favorites.push(song);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    return !exists;
}