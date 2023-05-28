import initializeHeader from "./header-initializer.js";
import {fillPersonMoviesMediaScroller} from "./media-scroller.js";

const apiKey = 'k_34mdujn4';

window.onload = () => {
    initializeHeader();
    initPersonDetails();
}

async function initPersonDetails() {
    try {
        const href = location.href;
        const personIMDbid = href.substring(href.lastIndexOf('/') + 1);
        const response = await fetch('https://imdb-api.com/en/API/Name/' + apiKey + '/' + personIMDbid);
        const responseBody = await response.json();
        setPersonDetails(responseBody);
    } catch (e) {
        console.log("Error: " + e);
    }
}


function setPersonDetails(data) {
    console.log(data);

    document.getElementById('title').innerHTML = data.name;
    document.getElementById('person-poster').src = data.image;

    const personDescription = document.querySelector('.movie-description');

    const pRole = document.createElement('p');
    const spanRole = document.createElement('span');
    spanRole.innerHTML = 'Role: ';
    pRole.appendChild(spanRole);
    pRole.textContent += data.role;
    personDescription.appendChild(pRole);

    const pBirthday = document.createElement('p');
    const spanBirthday = document.createElement('span');
    spanBirthday.innerHTML = 'Birthday: ';
    let yourDate = new Date(data.birthDate);
    pBirthday.appendChild(spanBirthday);
    pBirthday.textContent += yourDate.toISOString().split('T')[0];
    personDescription.appendChild(pBirthday);

    const pAwards = document.createElement('p');
    const spanAwards = document.createElement('span');
    spanAwards.innerHTML = 'Awards: ';
    pAwards.appendChild(spanAwards);
    pAwards.textContent += data.awards;
    personDescription.appendChild(pAwards);

    const pHeight = document.createElement('p');
    const spanHeight = document.createElement('span');
    spanHeight.innerHTML = 'Height: ';
    pHeight.appendChild(spanHeight);
    pHeight.textContent += data.height;
    personDescription.appendChild(pHeight);

    if (data.deathDate != null) {
        const pDeathDay = document.createElement('p');
        const spanDeathDay = document.createElement('span');
        spanDeathDay.innerHTML = 'Death-day: ';
        pDeathDay.appendChild(spanDeathDay);
        pDeathDay.textContent += data.deathDate;
        personDescription.appendChild(pDeathDay);
    }

    const pDescription = document.createElement('p');
    pDescription.setAttribute('class', 'movie-plot');
    pDescription.innerHTML = data.summary;
    personDescription.appendChild(pDescription);

    fillPersonMoviesMediaScroller(data.knownFor);
    //
    // const castCardContainer = document.querySelector('.cast-card-container');
    // data.knownFor.forEach((movie) => {
    //     const a = document.createElement('a');
    //     a.href = '/movie/'+ movie.id;
    //
    //     const movieDiv = document.createElement('div');
    //     movieDiv.setAttribute('class', 'person-card');
    //
    //     const card = document.createElement('div');
    //     card.setAttribute('class', 'card');
    //
    //     const img = document.createElement('img');
    //     img.src = movie.image;
    //     img.alt = movie.fullTitle + '.png';
    //     card.appendChild(img)
    //
    //     const movieDescription = document.createElement('div');
    //     movieDescription.setAttribute('class', 'person-description');
    //     const  p = document.createElement('p');
    //     p.innerHTML = 'In ' + movie.title;
    //     const  p2 = document.createElement('p');
    //     p2.innerHTML = 'as ' + '\"' + movie.role + '\"';
    //     movieDescription.appendChild(p);
    //     movieDescription.appendChild(p2);
    //     movieDiv.appendChild(card);
    //     movieDiv.appendChild(movieDescription);
    //     a.appendChild(movieDiv);
    //     castCardContainer.appendChild(a);
    // });
}