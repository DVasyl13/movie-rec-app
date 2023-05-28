import initializeHeader from "./header-initializer.js";
import {fillPersonMoviesMediaScroller} from "./media-scroller.js";

window.onload = () => {
    initializeHeader();
    getPopularMoviesFromApi();
    getClassicMoviesFromApi();
    getUsersFavouriteMoviesFromApi();
}

async function getPopularMoviesFromApi() {
    try {
        const response = await fetch('/api/vi/movie/popular');
        const responseBody = await response.json();
        console.log(responseBody);
        setClassicMovies(responseBody, 'popular-scroller', 'popular');
    } catch (e) {
        console.error("Error: " + e);
    }

}

async function getClassicMoviesFromApi() {
    try {
        const response = await fetch('/api/vi/movie/top250');
        const responseBody = await response.json();
        console.log(responseBody);
        setClassicMovies(responseBody, 'classic-scroller', 'classic');
    } catch (e) {
        console.error("Error: " + e);
    }

}


async function getUsersFavouriteMoviesFromApi() {
    try {
        const response = await fetch('/api/vi/movie/favourite');
        const responseBody = await response.json();
        console.log(responseBody);
        setClassicMovies(responseBody, 'favourite-scroller', 'favourite');
    } catch (e) {
        console.error("Error: " + e);
    }

}

function setClassicMovies(data, selector, groupName) {
    fillPersonMoviesMediaScroller(data,selector, groupName);
}
