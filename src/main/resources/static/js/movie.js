import initializeHeader from "./header-initializer.js";
import {fillCastMediaScroller, fillMovieMediaScroller} from "./media-scroller.js";

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
    spanReleased.innerHTML = 'Released: ';
    let yourDate = new Date(data.releaseDate);
    pReleased.appendChild(spanReleased);
    pReleased.textContent += yourDate.toISOString().split('T')[0];
    movieDescription.appendChild(pReleased);

    const pRuntime = document.createElement('p');
    const spanRuntime = document.createElement('span');
    spanRuntime.innerHTML = 'Runtime: ';
    pRuntime.appendChild(spanRuntime);
    pRuntime.textContent += data.runtimeMins + 'min';
    movieDescription.appendChild(pRuntime);

    const pDirectors = document.createElement('p');
    const spanDirectors = document.createElement('span');
    spanDirectors.innerHTML = 'Directors: ';
    pDirectors.appendChild(spanDirectors);
    const arrayOfDirectors = data.directorList.map((value) => {
        return value.name;
    });
    pDirectors.textContent += arrayOfDirectors.toString().replaceAll(',', ', ');
    movieDescription.appendChild(pDirectors);

    const pWrites = document.createElement('p');
    const spanWriters = document.createElement('span');
    spanWriters.innerHTML = 'Writers: ';
    pWrites.appendChild(spanWriters);
    const arrayOfWriters = data.writerList.map((value) => {
        return value.name;
    });
    pWrites.textContent += arrayOfWriters.toString().replaceAll(',', ', ');
    movieDescription.appendChild(pWrites);

    const pStudious = document.createElement('p');
    const spanStudious = document.createElement('span');
    spanStudious.innerHTML = 'Studious: ';
    pStudious.appendChild(spanStudious);
    pStudious.textContent += data.companies;
    movieDescription.appendChild(pStudious);

    const pGenres = document.createElement('p');
    const spanGenres = document.createElement('span');
    spanGenres.innerHTML = 'Genres: ';
    pGenres.appendChild(spanGenres);
    const arrayOfGenres = data.genreList.map((value) => {
        return value.value;
    });
    pGenres.textContent += arrayOfGenres.toString().replaceAll(',', ', ');
    movieDescription.appendChild(pGenres);

    const pAwards = document.createElement('p');
    const spanAwards = document.createElement('span');
    spanAwards.innerHTML = 'Awards: ';
    pAwards.appendChild(spanAwards);
    pAwards.textContent += data.awards;
    movieDescription.appendChild(pAwards);

    const pCountry = document.createElement('p');
    const spanCountry = document.createElement('span');
    spanCountry.innerHTML = 'Country: ';
    pCountry.appendChild(spanCountry);
    pCountry.textContent += data.countries;
    movieDescription.appendChild(pCountry);

    const pBudget = document.createElement('p');
    const spanBudget = document.createElement('span');
    spanBudget.innerHTML = 'Budget: ';
    pBudget.appendChild(spanBudget);
    pBudget.textContent += data.boxOffice.budget;
    movieDescription.appendChild(pBudget);

    const pOwUsa = document.createElement('p');
    const spanOwUsa = document.createElement('span');
    spanOwUsa.innerHTML = 'Opening weekend USA: ';
    pOwUsa.appendChild(spanOwUsa);
    pOwUsa.textContent += data.boxOffice.openingWeekendUSA;
    movieDescription.appendChild(pOwUsa);

    const pCWG = document.createElement('p');
    const spanCWG = document.createElement('span');
    spanCWG.innerHTML = 'Cumulative worldwide gross: ';
    pCWG.appendChild(spanCWG);
    pCWG.textContent += data.boxOffice.cumulativeWorldwideGross;
    movieDescription.appendChild(pCWG);

    const moviePlot = document.createElement('p');
    moviePlot.setAttribute('class', 'movie-plot');
    moviePlot.textContent = data.plot;
    movieDescription.appendChild(moviePlot);

    document.getElementById('movie-poster').src = data.image;
    document.getElementById('trailer-btn').href = data.trailer.link;

    fillMovieMediaScroller(data.similars, 'movie-scroller','movie');
    fillCastMediaScroller(data.actorList, 'cast');
}