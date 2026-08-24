import { toggleFavorite, isFavorite } from "./favorites.js";

let currentAudio = null;
let currentSong = null;
let hasPlayed = false

export function displaySongs(songs) {
    const container = document.querySelector("#songs")

    container.innerHTML = ""

    songs.forEach(song => {
        const card = document.createElement("div")
        card.classList.add("song-card")

        const imageWrapper = document.createElement("div")
        imageWrapper.classList.add("song-image-wrapper")

        const image = document.createElement("img")
        image.classList.add("song-image")
        image.src = song.album.cover_medium;
        image.alt = song.title;

        const favoriteBtn = document.createElement("button")
        favoriteBtn.classList.add("favorite-btn")
        favoriteBtn.innerHTML = ` <svg viewBox="0 0 24 24">
        <path d="M12 21s-7-4.4-9.5-9C.5 8 3 4 7 4c2.3 0 4 1.5 5 3 1-1.5 2.7-3 5-3 4 0 6.5 4 4.5 8C19 16.6 12 21 12 21Z"/>
      </svg>`;
        if (isFavorite(song.id)) {
            favoriteBtn.classList.add("favorite-active");
        }


        favoriteBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            const favorite = toggleFavorite(song);

            favoriteBtn.classList.toggle(
                "favorite-active",
                favorite
            );
        });

        imageWrapper.append(image, favoriteBtn);


        const info = document.createElement("div")
        info.classList.add("song-info")

        const title = document.createElement("h3")
        title.textContent = song.title

        const artist = document.createElement("p")
        artist.textContent = song.artist.name




        info.append(title, artist)

        card.addEventListener("click", () => {
            showSongDetail(song);
        });
        card.append(imageWrapper, info);
        container.appendChild(card)

    });
}


function showSongDetail(song) {
    const detail = document.querySelector("#song-detail");
    const miniPlayer = document.querySelector("#mini-player");
    const sameSong = currentSong && currentSong.id === song.id;
    miniPlayer.classList.add("hidden");
    
    if (!sameSong) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentSong = song;
        currentAudio = new Audio(song.preview);
        hasPlayed = false;

        miniPlayer.classList.add("hidden");

        currentAudio.addEventListener("play", () => {
            hasPlayed = true;
            updateMiniPlayer();
        });

        currentAudio.addEventListener("pause", () => {
            updateMiniPlayer();
        });

        currentAudio.addEventListener("ended", () => {
            hasPlayed = false;
            miniPlayer.classList.add("hidden");
        });
    }




    detail.innerHTML = `
        <div class="detail-card">

            <div class="detail-header">

                <button class="back-btn">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                    </svg>

                    Back
                </button>

                <button class="detail-favorite">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 21s-7-4.4-9.5-9C.5 8 3 4 7 4c2.3 0 4 1.5 5 3 1-1.5 2.7-3 5-3 4 0 6.5 4 4.5 8C19 16.6 12 21 12 21Z"/>
                    </svg>
                </button>

            </div>

            <img
                class="detail-image"
                src="${song.album.cover_big}"
                alt="${song.title}"
            >

            <h1>${song.title}</h1>

            <p>${song.artist.name}</p>

            <div class="audio-container"></div>

        </div>
    `;
    detail.classList.remove("hidden");


    currentAudio.controls = true;
    currentAudio.classList.add("detail-audio");
    const audioContainer = detail.querySelector(".audio-container");

    audioContainer.appendChild(currentAudio);






    const backButton = detail.querySelector(".back-btn")

    backButton.addEventListener("click", () => {
        detail.classList.add("hidden")


        // Sirf tab mini player show ho agar song play hua ho
        if (hasPlayed) {
            miniPlayer.classList.remove("hidden");
            updateMiniPlayer();
        }
    })

    const favorite = detail.querySelector(".detail-favorite");

    if (isFavorite(song.id)) {
        favorite.classList.add("favorite-active");
    }

    favorite.addEventListener("click", () => {
        const favoriteStatus = toggleFavorite(song);

        favorite.classList.toggle("favorite-active", favoriteStatus);
    });


}

function updateMiniPlayer() {
    const miniPlayer = document.querySelector("#mini-player");

    if (!miniPlayer) return;

    if (!currentSong || !hasPlayed || !currentAudio) {
        miniPlayer.classList.add("hidden");
        return;
    }

    const playing = !currentAudio.paused;

    miniPlayer.innerHTML = `
        <img
            src="${currentSong.album.cover_small}"
            alt="${currentSong.title}"
        >

        <div class="mini-song-info">
            <h4>${currentSong.title}</h4>
            <p>${currentSong.artist.name}</p>
        </div>

        <button class="mini-play-btn">
            ${playing
            ? `
                        <svg viewBox="0 0 24 24">
                            <rect x="6" y="5" width="4" height="14"></rect>
                            <rect x="14" y="5" width="4" height="14"></rect>
                        </svg>
                    `
            : `
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"></path>
                        </svg>
                    `
        }
        </button>

        <button class="mini-stop-btn">
            <svg viewBox="0 0 24 24">
                <path d="M6 6l12 12"></path>
                <path d="M18 6L6 18"></path>
            </svg>
        </button>
    `;

    miniPlayer.onclick = () => {
        const detail = document.querySelector("#song-detail");

        detail.classList.remove("hidden");
        miniPlayer.classList.add("hidden");
    }

    const playButton = miniPlayer.querySelector(".mini-play-btn")

    playButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }

        updateMiniPlayer();
    });

    const stopButton = miniPlayer.querySelector(".mini-stop-btn");

    stopButton.addEventListener("click", (event) => {
        event.stopPropagation();

        currentAudio.pause();
        currentAudio.currentTime = 0;

        hasPlayed = false;

        miniPlayer.classList.add("hidden");
    });


}