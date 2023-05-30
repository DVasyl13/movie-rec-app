import initializeHeader from "./header-initializer.js";
import {initNotAuthorizedPage} from "./saved.js";
import {fillExtendedMoviesMediaScroller} from "./media-scroller.js";

window.onload = () => {
    initializeHeader();
    checkIfAuthorized();
}


function checkIfAuthorized() {
    if (sessionStorage.getItem('id') != null) {
        initPage();
    } else {
        initNotAuthorizedPage();
    }
}

function initPage() {
    document.getElementById('container').setAttribute('class', 'container');
    getDirectorBasedMovies();
    getSimilarBasedMovies();
}

async function getDirectorBasedMovies() {
    const response = await fetch('/api/v1/user/' + sessionStorage.getItem('id') + '/director-based-movies');
    const responseBody = await response.json();
    fillExtendedMoviesMediaScroller(responseBody, 'director-based-scroller','director-based');
}

async function getSimilarBasedMovies() {
    const response = await fetch('/api/v1/user/' + sessionStorage.getItem('id') + '/similar-based-movies');
    const responseBody = await response.json();
    fillExtendedMoviesMediaScroller(responseBody, 'similar-based-scroller','similar-based');
}