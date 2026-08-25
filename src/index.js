import "./style.css";
import { getData, getSearchPage } from "./apiHandle.js";
import { displaySongs } from './domHandler.js';
import { getFavorites } from "./favorites.js";

const input = document.querySelector("#search")
const button = document.querySelector("#btn")
const homeBtn = document.querySelector("#home-btn");
const favoritesBtn = document.querySelector("#favorites-btn");
const loader = document.querySelector("#loader");
const songsContainer = document.querySelector("#songs");
const pagination = document.querySelector("#pagination");
const sectionTitle = document.querySelector("#section-title");

let currentSongs = [];
let homeSongs = [];
let currentQuery = "";
let currentPage = 1;
let totalPages = 1;

async function loadRandomSongs() {
    loader.classList.remove("hidden");
    pagination.classList.add("hidden");

    try {
        const randomQueries = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "love",
            "night",
            "music",
            "party",
            "dream",
            "heart",
            "dance",
            "summer",
            "life",
            "world"
        ];

        let songs = [];

        for (let i = 0; i < 5; i++) {

            const randomQuery =
                randomQueries[
                Math.floor(Math.random() * randomQueries.length)
                ];

            const randomIndex =
                Math.floor(Math.random() * 10) * 25;

            songs = await getData(randomQuery, randomIndex);

            if (songs.length >= 12) {
                break;
            }
        }

        if (songs.length < 12) {
            songs = await getData("music", 0);
        }

        const shuffledSongs = songs.sort(
            () => Math.random() - 0.5
        );

        homeSongs = shuffledSongs.slice(0, 12);
        currentSongs = homeSongs;

        displaySongs(homeSongs);

    } catch (error) {
        console.error(error);

    } finally {
        loader.classList.add("hidden");
    }
}
loadRandomSongs();

button.addEventListener("click", async () => {
    const query = input.value.trim();

    if (!query) return;

    favoritesBtn.classList.remove("active");
    homeBtn.classList.add("active");

    currentQuery = query;
    currentPage = 1;

    await loadSearchPage(currentPage);
});

async function loadSearchPage(page) {
    loader.classList.remove("hidden");
    songsContainer.classList.add("hidden");
    pagination.classList.add("hidden");

    try {
        const result = await getSearchPage(currentQuery, page);

        currentSongs = result.songs;
        currentPage = page;

        totalPages = Math.ceil(result.total / 12);

        displaySongs(currentSongs);

        renderPagination();

    } catch (error) {
        console.error(error);

    } finally {
        loader.classList.add("hidden");
        songsContainer.classList.remove("hidden");
    }
}

function renderPagination() {
    pagination.innerHTML = "";

    if (totalPages <= 1) {
        pagination.classList.add("hidden");
        return;
    }

    // Previous
    const previousBtn = document.createElement("button");
    previousBtn.textContent = "Previous";

    previousBtn.disabled = currentPage === 1;

    previousBtn.addEventListener("click", () => {
        loadSearchPage(currentPage - 1);
    });

    pagination.appendChild(previousBtn);


    // Maximum 5 page numbers show honge
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }


    for (let page = startPage; page <= endPage; page++) {

        const pageBtn = document.createElement("button");

        pageBtn.textContent = page;

        if (page === currentPage) {
            pageBtn.classList.add("active-page");
        }

        pageBtn.addEventListener("click", () => {
            loadSearchPage(page);
        });

        pagination.appendChild(pageBtn);
    }


    // Next
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";

    nextBtn.disabled = currentPage === totalPages;

    nextBtn.addEventListener("click", () => {
        loadSearchPage(currentPage + 1);
    });

    pagination.appendChild(nextBtn);

    pagination.classList.remove("hidden");
}


favoritesBtn.addEventListener("click", () => {
    pagination.classList.add("hidden");
    sectionTitle.textContent = "Favorite Songs";

    const favorites = getFavorites();

    displaySongs(favorites);

    homeBtn.classList.remove("active");
    favoritesBtn.classList.add("active");
});

homeBtn.addEventListener("click", () => {
    pagination.classList.add("hidden");
    sectionTitle.textContent = "All Songs";

    displaySongs(homeSongs);

    favoritesBtn.classList.remove("active");
    homeBtn.classList.add("active");
});




