import initializeHeader from "./header-initializer.js";

let elementContainer;


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
    const container = document.getElementById('container');
    container.setAttribute('class', 'container');
    const nav = document.createElement('div');
    nav.setAttribute('class', 'navigation');

    const a = document.createElement('a');
    a.href = '/account';
    const p = document.createElement('p');
    p.setAttribute('class', 'nav-element large-text');
    p.innerHTML = sessionStorage.getItem('username') + ' savings';
    a.appendChild(p);
    nav.appendChild(a);

    const navMain = document.createElement('div');
    navMain.setAttribute('class', 'navigation-main');

    const buttonWatched = document.createElement('button');
    buttonWatched.setAttribute('class','nav-btn');
    buttonWatched.setAttribute('id', 'watched');
    buttonWatched.innerHTML = 'Watched';

    const buttonLiked = document.createElement('button');
    buttonLiked.setAttribute('class','nav-btn');
    buttonLiked.setAttribute('id', 'liked');
    buttonLiked.innerHTML = 'Liked';

    const buttonIgnored = document.createElement('button');
    buttonIgnored.setAttribute('class','nav-btn');
    buttonIgnored.setAttribute('id', 'ignored');
    buttonIgnored.innerHTML = 'Ignored';
    navMain.appendChild(buttonWatched);
    navMain.appendChild(buttonLiked);
    navMain.appendChild(buttonIgnored);

    const pSection = document.createElement('p');
    pSection.setAttribute('class', 'nav-element small-text top-padding');
    pSection.setAttribute('id', 'section-name');

    nav.appendChild(navMain);
    nav.appendChild(pSection);

    const elContainer = document.createElement('div');
    elContainer.setAttribute('class', 'element-container');
    elementContainer = elContainer;

    container.appendChild(nav);
    container.appendChild(elContainer);
}

function initNotAuthorizedPage() {
    const container = document.getElementById('container');
    container.setAttribute('class', 'not-authorized-container');
    const p = document.createElement('p');
    p.setAttribute('class', 'medium-text');
    p.innerHTML = 'It seems you are not authorized';
    container.appendChild(p);
}

$(document).on("click", "#liked", function(){
    getUsersMovies('liked');
    document.getElementById('section-name').innerHTML = 'Your liked:';
});

$(document).on("click", "#ignored", function(){
    getUsersMovies('ignored');
    document.getElementById('section-name').innerHTML = 'Your ignored:';
});

$(document).on("click", "#watched", function(){
    getUsersMovies('watched');
    document.getElementById('section-name').innerHTML = 'Your watched:';
});

async function getUsersMovies(section) {
    try {
        const response = await fetch('/api/v1/user/' + sessionStorage.getItem('id')+ '/' + section)
        const responseBody = await response.json();
    setUsersMovies(responseBody);
    } catch (e) {
        console.error("Error: " + e);
    }
}

function setUsersMovies(data) {
    console.log(data);
    $(elementContainer).empty();
    data.forEach(e => {
        const mainElement = document.createElement('div');
        mainElement.setAttribute('class', 'main-element');

        const leftSection = document.createElement('div');
        leftSection.setAttribute('class', 'main-element-left-section');
        const img = document.createElement('img');
        img.src = e.image;
        const a = document.createElement('a');
        a.href = e.trailer.link;
        const p = document.createElement('p');
        p.innerHTML = 'Trailer';
        a.appendChild(p);
        leftSection.appendChild(img);
        leftSection.appendChild(a);
        mainElement.appendChild(leftSection);

        const rightSection = document.createElement('div');
        rightSection.setAttribute('class', 'main-element-right-section');

        const headerElement = document.createElement('div');
        headerElement.setAttribute('class', 'header-text-element');
        const aHeader = document.createElement('a');
        aHeader.href = '/movie/'+e.id;
        const pHeader = document.createElement('p');
        pHeader.setAttribute('class', 'large-text');
        pHeader.innerHTML = e.fullTitle;
        aHeader.appendChild(pHeader);
        headerElement.appendChild(aHeader);
        rightSection.appendChild(headerElement);

        const elementDescription = document.createElement('div');
        elementDescription.setAttribute('class', 'element-description');

        const pReleased = document.createElement('p');
        pReleased.setAttribute('class', 'medium-text');
        let yourDate = new Date(e.releaseDate);
        pReleased.innerHTML = yourDate.toISOString().split('T')[0];
        elementDescription.appendChild(pReleased);

        const pRuntime = document.createElement('p');
        pRuntime.setAttribute('class', 'medium-text');
        pRuntime.innerHTML = e.runtimeMins + 'min';
        elementDescription.appendChild(pRuntime);

        const pGenres = document.createElement('p');
        pGenres.setAttribute('class', 'medium-text');
        const arrayOfGenres = e.genreList.map((value) => {
            return value.value;
        });
        pGenres.innerHTML = arrayOfGenres.toString().replaceAll(',', ', ');
        elementDescription.appendChild(pGenres);

        const pCountry = document.createElement('p');
        pCountry.setAttribute('class', 'medium-text');
        pCountry.innerHTML = e.countries;
        elementDescription.appendChild(pCountry);

        const pStudious = document.createElement('p');
        pStudious.setAttribute('class', 'medium-text');
        pStudious.innerHTML = e.companies;
        elementDescription.appendChild(pStudious);

        const pAwards = document.createElement('p');
        pAwards.setAttribute('class', 'medium-text');
        pAwards.innerHTML = e.awards;
        elementDescription.appendChild(pAwards);


        const pDirectors = document.createElement('p');
        pDirectors.setAttribute('class', 'medium-text');
        const arrayOfDirectors = e.directorList.map((value) => {
            return value.name;
        });
        pDirectors.innerHTML = 'by '+ arrayOfDirectors.toString().replaceAll(',', ', ');
        elementDescription.appendChild(pDirectors);
        rightSection.appendChild(elementDescription);

        const ratingSection = document.createElement('div');
        ratingSection.setAttribute('class', 'rating-section');

        const pIMDbRating = document.createElement('p');
        pIMDbRating.setAttribute('class', 'medium-text');
        pIMDbRating.innerHTML = 'IMDb: '+ e.imDbRating + '/10 ('+e.imDbRatingVotes+')';
        ratingSection.appendChild(pIMDbRating);

        const pMetacriricRating = document.createElement('p');
        pMetacriricRating.setAttribute('class', 'medium-text');
        pMetacriricRating.innerHTML = 'Metacritic: '+ e.metacriticRating;
        ratingSection.appendChild(pMetacriricRating);

        rightSection.appendChild(ratingSection);
        mainElement.appendChild(rightSection);
        elementContainer.appendChild(mainElement);
    });
}