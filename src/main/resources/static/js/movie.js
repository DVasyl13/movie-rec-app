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
    const movieIMDbid = href.substring(href.lastIndexOf('/') + 1);
    getMovieDetailsFromApi(movieIMDbid);
}


async function getMovieDetailsFromApi(id) {
    try {
        const response = await fetch('/api/vi/movie/' + id);
        const responseBody = await response.json();
        setMovieDetails(responseBody);
    } catch (e) {
        console.error("Error: " + e );
    }
}

function setMovieDetails(data) {
    console.log(data);

    const title = document.createElement('p');
    title.setAttribute('id','title');
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
    metaCriticImg.src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Metacritic_logo.svg/2560px-Metacritic_logo.svg.png"

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
    pDirectors.textContent +=arrayOfDirectors.toString().replaceAll(',', ', ');
    movieDescription.appendChild(pDirectors);

    const pWrites = document.createElement('p');
    const spanWriters = document.createElement('span');
    spanWriters.innerHTML = 'Writers: ';
    pWrites.appendChild(spanWriters);
    const arrayOfWriters = data.writerList.map((value) => {
        return value.name;
    });
    pWrites.textContent +=arrayOfWriters.toString().replaceAll(',', ', ');
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
    pGenres.textContent +=arrayOfGenres.toString().replaceAll(',', ', ');
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
    pOwUsa.textContent = data.boxOffice.openingWeekendUSA;
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


    const movieCardContainer = document.querySelector('.movie-card-container');
    data.similars.forEach((movie) => {
        const a = document.createElement('a');
        a.href = '/movie/'+ movie.id;
        const cardDiv = document.createElement('div');
        cardDiv.setAttribute('class', 'card');
        const img = document.createElement('img');
        img.src = movie.image;
        img.alt = movie.title + '.png';
        cardDiv.appendChild(img)
        a.appendChild(cardDiv);
        movieCardContainer.appendChild(a);
    });

    const castCardContainer = document.querySelector('.cast-card-container');
    data.actorList.forEach((actor) => {
        const a = document.createElement('a');
        a.href = '/person/'+ actor.id;

        const cardDiv = document.createElement('div');
        cardDiv.setAttribute('class', 'person-card');

        const actorDiv = document.createElement('div');
        actorDiv.setAttribute('class', 'card');

        const img = document.createElement('img');
        img.src = actor.image;
        img.alt = actor.name + '.png';
        actorDiv.appendChild(img)

        const personDescription = document.createElement('div');
        personDescription.setAttribute('class', 'person-description');
        const  p = document.createElement('p');
        p.innerHTML = actor.name;
        personDescription.appendChild(p);
        cardDiv.appendChild(actorDiv);
        cardDiv.appendChild(personDescription);
        a.appendChild(cardDiv);
        castCardContainer.appendChild(a);
    });
}