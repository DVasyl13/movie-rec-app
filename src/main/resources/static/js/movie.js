import initializeHeader from "./header-initializer.js";

window.onload = () => {
    initializeHeader();
    initMovieDetails();
}

let likeButton = document.getElementById("like-btn");
likeButton.addEventListener("click", function() {
    likeButton.classList.toggle("btn-liked");
});

let ignoreBtn = document.getElementById("ignore-btn");
ignoreBtn.addEventListener("click", function() {
    const childSpan = ignoreBtn.childNodes.item(0);
    if (childSpan.textContent === 'close') {
        childSpan.textContent = 'done';
    } else {
        childSpan.textContent = 'close';
    }
});

let watchedBtn = document.getElementById("watched-btn");
watchedBtn.addEventListener("click", function() {
    const childSpan = watchedBtn.childNodes.item(0);
    if (childSpan.textContent === 'add') {
        childSpan.textContent = 'done';
    } else {
        childSpan.textContent = 'add';
    }
});

function initMovieDetails() {
    const href = location.href;
    const movieIMDbid = href.substring(href.lastIndexOf('/'));
    const detailsFromApi = getMovieDetailsFromApi(movieIMDbid);
    setMovieDetails(detailsFromApi);
}


async function getMovieDetailsFromApi(id) {
    try {
        const response = await fetch('/api/vi/movie/' + id);
        return await response.json();
    } catch (e) {
        console.error("Error: " + e );
    }
}

function setMovieDetails(data) {
    console.log(data);

}