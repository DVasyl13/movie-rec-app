import initializeHeader from "./header-initializer.js";
import {fillCastMediaScroller, fillExtendedMoviesMediaScroller, fillMovieMediaScroller} from "./media-scroller.js";

const ignoreBtn = document.getElementById("ignore-btn");
const likeButton = document.getElementById("like-btn");
const watchedBtn = document.getElementById("watched-btn");
let movieIMDbid;

window.onload = () => {
    initializeHeader();
    initMovieDetails();
    initUserDetails();
}

function isUserAuthorized() {
    return sessionStorage.getItem('id') != null;
}

function initUserDetails() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
    if (user.likedMovies.includes(movieIMDbid)) {
        toggleLikeButton();
    }
    if (user.ignoredMovies.includes(movieIMDbid)) {
        toggleIgnoreButton();
    }
    if (user.watchedMovies.includes(movieIMDbid)) {
        toggleWatchedButton();
    }
}

likeButton.addEventListener("click", function () {
    if (isUserAuthorized()) {
        doToggleToButton('liked');
        toggleLikeButton();
        removeIgnoredButton();
        toggleLikedInCache();
    } else  {
        console.log("User is not authorized!")
    }
});

ignoreBtn.addEventListener("click", function () {
    if (isUserAuthorized()) {
        doToggleToButton('ignored');
        toggleIgnoreButton();
        removeLikedButton();
        toggleIgnoredInCache();
    } else  {
        console.log("User is not authorized!");
    }
});

watchedBtn.addEventListener("click", function () {
    if (isUserAuthorized()) {
        doToggleToButton('watched');
        toggleWatchedButton();
        toggleWatchedInCache();
    } else  {
        console.log("User is not authorized!");
    }
});

function toggleIgnoredInCache() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user.ignoredMovies.includes(movieIMDbid)){
        user.ignoredMovies.splice(user.ignoredMovies.indexOf(movieIMDbid));
    } else{
        user.ignoredMovies.push(movieIMDbid);
        user.likedMovies.splice(user.likedMovies.indexOf(movieIMDbid));
    }
    console.log(user);
    sessionStorage.setItem('user', JSON.stringify(user));
}

function toggleLikedInCache() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user.likedMovies.includes(movieIMDbid)){
        user.likedMovies.splice(user.likedMovies.indexOf(movieIMDbid));
    }else{
        user.likedMovies.push(movieIMDbid);
        user.ignoredMovies.splice(user.ignoredMovies.indexOf(movieIMDbid));
    }
    console.log(user);
    sessionStorage.setItem('user', JSON.stringify(user));
}

function toggleWatchedInCache() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user.watchedMovies.includes(movieIMDbid)){
        user.watchedMovies.splice(user.watchedMovies.indexOf(movieIMDbid));
    } else {
        user.watchedMovies.push(movieIMDbid);
    }
    console.log(user);
    sessionStorage.setItem('user', JSON.stringify(user));
}


function toggleWatchedButton() {
    const childSpan = watchedBtn.childNodes.item(0);
    if (childSpan.textContent === 'add') {
        childSpan.textContent = 'done';
    } else {
        childSpan.textContent = 'add';
    }
}

function toggleIgnoreButton() {
    const childSpan = ignoreBtn.childNodes.item(0);
    childSpan.textContent === 'close' ?
        childSpan.textContent = 'done'
        : childSpan.textContent = 'close';
}

function toggleLikeButton() {
    likeButton.classList.toggle("btn-liked");
}

function removeLikedButton() {
    likeButton.classList.remove('btn-liked');
}

function removeIgnoredButton() {
    ignoreBtn.childNodes.item(0).textContent = 'close';
}

async function doToggleToButton(buttonName) {
    const body = {
        id: sessionStorage.getItem('id'),
        password: sessionStorage.getItem('password'),
        movieId: movieIMDbid
    };
    try {
        const response = await fetch('/api/v1/user/' + buttonName, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(body)
        });

        const responseBody = await response.json();
        //TODO: to do this
        console.log(responseBody);
    } catch (e) {
        console.error("Error: " + e);
    }
}

function initMovieDetails() {
    const href = location.href;
    movieIMDbid = href.substring(href.lastIndexOf('/') + 1);
    getMovieDetailsFromApi(movieIMDbid);
}

async function getMovieDetailsFromApi(id) {
    try {
        const response = await fetch('/api/vi/movie/' + id);
        const responseBody = await response.json();
        setMovieDetails(responseBody);
    } catch (e) {
        console.error("Error: " + e);
    }
}

function setMovieDetails(data) {
    console.log(data);

    const title = document.createElement('p');
    title.setAttribute('id', 'title');
    title.innerHTML = data.fullTitle;
    document.querySelector('.movie-title').appendChild(title);

    const imgImdb = document.createElement('img')
    imgImdb.setAttribute('class', 'rating-icon');
    imgImdb.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png";
    const ratingRateImDb = document.createElement('p')
    ratingRateImDb.setAttribute('class', 'rating-rate');
    ratingRateImDb.innerHTML = data.imDbRating;
    const ratingVotes = document.createElement('p')
    ratingVotes.setAttribute('class', 'rating-votes');
    ratingVotes.innerHTML = data.imDbRatingVotes;
    document.getElementById('imdb-rating').appendChild(imgImdb);
    document.getElementById('imdb-rating').appendChild(ratingRateImDb);
    document.getElementById('imdb-rating').appendChild(ratingVotes);

    const metaCriticImg = document.createElement('img');
    metaCriticImg.setAttribute('class', 'rating-icon');
    metaCriticImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Metacritic_logo.svg/2560px-Metacritic_logo.svg.png"

    const ratingRateMeta = document.createElement('p')
    ratingRateMeta.setAttribute('class', 'rating-rate');
    ratingRateMeta.innerHTML = data.metacriticRating;
    document.getElementById('metacritic-rating').appendChild(metaCriticImg);
    document.getElementById('metacritic-rating').appendChild(ratingRateMeta);

    const movieDescription = document.querySelector('.movie-description');

    const pReleased = document.createElement('p');
    const spanReleased = document.createElement('span');
    const spanTextReleased  = document.createTextNode('Released: ');
    let yourDate = new Date(data.releaseDate);
    const pReleasedText = document.createTextNode(yourDate.toISOString().split('T')[0]);
    spanReleased.appendChild(spanTextReleased);
    pReleased.appendChild(spanReleased);
    pReleased.appendChild(pReleasedText);

    movieDescription.appendChild(pReleased);

    const pRuntime = document.createElement('p');
    const spanRuntime = document.createElement('span');
    const spanText = document.createTextNode('Runtime: ');
    const runtimeText = document.createTextNode(data.runtimeMins + 'min');

    spanRuntime.appendChild(spanText);
    pRuntime.appendChild(spanRuntime);
    pRuntime.appendChild(runtimeText);

    movieDescription.appendChild(pRuntime);

    const pDirectors = document.createElement('p');
    const spanDirectors = document.createElement('span');
    const spanTextDirectors  = document.createTextNode('Directors: ');
    const arrayOfDirectors = data.directorList.map((value) => {
        return value.name;
    });
    const pDirectorsText = document.createTextNode(arrayOfDirectors.toString().replaceAll(',', ', '));
    spanDirectors.appendChild(spanTextDirectors);
    pDirectors.appendChild(spanDirectors);
    pDirectors.appendChild(pDirectorsText);

    movieDescription.appendChild(pDirectors);

    const pWrites = document.createElement('p');
    const spanWriters = document.createElement('span');
    const spanTextWriters  = document.createTextNode('Writers: ');

    const arrayOfWriters = data.writerList.map((value) => {
        return value.name;
    });
    const pWritesText = document.createTextNode(arrayOfWriters.toString().replaceAll(',', ', '));
    spanWriters.appendChild(spanTextWriters);
    pWrites.appendChild(spanWriters);
    pWrites.appendChild(pWritesText);

    movieDescription.appendChild(pWrites);

    const pStudious = document.createElement('p');
    const spanStudious = document.createElement('span');
    const spanTextStudious  = document.createTextNode('Studious: ');
    const pStudiousText = document.createTextNode(data.companies);

    spanStudious.appendChild(spanTextStudious);
    pStudious.appendChild(spanStudious);
    pStudious.appendChild(pStudiousText);
    movieDescription.appendChild(pStudious);

    const pGenres = document.createElement('p');
    const spanGenres = document.createElement('span');
    const spanTextGenres  = document.createTextNode('Genres: ');
    const arrayOfGenres = data.genreList.map((value) => {
        return value.value;
    });
    const pGenresText = document.createTextNode(arrayOfGenres.toString().replaceAll(',', ', '));
    spanGenres.appendChild(spanTextGenres);
    pGenres.appendChild(spanGenres);
    pGenres.appendChild(pGenresText);
    movieDescription.appendChild(pGenres);

    const pAwards = document.createElement('p');
    const spanAwards = document.createElement('span');
    const spanTextAwards  = document.createTextNode('Awards: ');
    const pAwardsText = document.createTextNode(data.awards);
    spanAwards.appendChild(spanTextAwards);
    pAwards.appendChild(spanAwards);
    pAwards.appendChild(pAwardsText);
    movieDescription.appendChild(pAwards);

    const pCountry = document.createElement('p');
    const spanCountry = document.createElement('span');
    const spanTextCountry  = document.createTextNode('Country: ');
    const pCountryText = document.createTextNode(data.countries);

    spanCountry.appendChild(spanTextCountry);
    pCountry.appendChild(spanCountry);
    pCountry.appendChild(pCountryText);

    movieDescription.appendChild(pCountry);

    const pBudget = document.createElement('p');
    const spanBudget = document.createElement('span');
    const spanTextBudget  = document.createTextNode('Budget: ');
    const pBudgetText = document.createTextNode(data.boxOffice.budget);
    spanBudget.appendChild(spanTextBudget);
    pBudget.appendChild(spanBudget);
    pBudget.appendChild(pBudgetText);

    movieDescription.appendChild(pBudget);

    const pOwUsa = document.createElement('p');
    const spanOwUsa = document.createElement('span');
    const spanTextOwUsa  = document.createTextNode('Opening weekend USA: ');
    const pOwUsaText = document.createTextNode(data.boxOffice.openingWeekendUSA);
    spanOwUsa.appendChild(spanTextOwUsa);
    pOwUsa.appendChild(spanOwUsa);
    pOwUsa.appendChild(pOwUsaText);

    movieDescription.appendChild(pOwUsa);

    const pCWG = document.createElement('p');
    const spanCWG = document.createElement('span');
    const spanTextCWG  = document.createTextNode('Cumulative worldwide gross: ');
    const pCWGText = document.createTextNode(data.boxOffice.cumulativeWorldwideGross);
    spanCWG.appendChild(spanTextCWG);
    pCWG.appendChild(spanCWG);
    pCWG.appendChild(pCWGText);

    movieDescription.appendChild(pCWG);

    const moviePlot = document.createElement('p');
    moviePlot.setAttribute('class', 'movie-plot');
    moviePlot.textContent = data.plot;
    movieDescription.appendChild(moviePlot);

    document.getElementById('movie-poster').src = data.image;
    document.getElementById('trailer-btn').href = data.trailer.link;

    fillExtendedMoviesMediaScroller(data.similars, 'movie-scroller','movie');
    fillCastMediaScroller(data.actorList, 'cast');
}