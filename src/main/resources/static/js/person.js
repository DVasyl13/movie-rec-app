import initializeHeader from "./header-initializer.js";
import {fillExtendedMoviesMediaScroller} from "./media-scroller.js";

const apiKey = 'k_34mdujn4';

window.onload = () => {
    initializeHeader();
    initPersonDetails();
}

async function initPersonDetails() {
    // try {
        const href = location.href;
        const personIMDbid = href.substring(href.lastIndexOf('/') + 1);
        const response = await fetch('https://imdb-api.com/en/API/Name/' + apiKey + '/' + personIMDbid);
        const responseBody = await response.json();
        setPersonDetails(responseBody);
    // } catch (e) {
    //     console.log("Error: " + e);
    // }
}


function setPersonDetails(data) {
    console.log(data);

    document.getElementById('title').innerHTML = data.name;
    document.getElementById('person-poster').src = data.image;

    const personDescription = document.querySelector('.movie-description');

    const pRole = document.createElement('p');
    const spanRole = document.createElement('span');
    const spanTextRole  = document.createTextNode('Role: ');
    const pRoleText = document.createTextNode(data.role);
    spanRole.appendChild(spanTextRole);
    pRole.appendChild(spanRole);
    pRole.appendChild(pRoleText);

    personDescription.appendChild(pRole);

    const pBirthday = document.createElement('p');
    const spanBirthday = document.createElement('span');
    const spanTextBirthday  = document.createTextNode('Birthday: ');
    let yourDate = new Date(data.birthDate);
    const pBirthdayText = document.createTextNode(yourDate.toISOString().split('T')[0]);

    spanBirthday.appendChild(spanTextBirthday);
    pBirthday.appendChild(spanBirthday);
    pBirthday.appendChild(pBirthdayText);
    personDescription.appendChild(pBirthday);

    const pAwards = document.createElement('p');
    const spanAwards = document.createElement('span');
    const spanTextAwards  = document.createTextNode('Awards: ');
    const pAwardText = document.createTextNode(data.awards);

    spanAwards.appendChild(spanTextAwards);
    pAwards.appendChild(spanAwards);
    pAwards.appendChild(pAwardText);

    personDescription.appendChild(pAwards);

    const pHeight = document.createElement('p');
    const spanHeight = document.createElement('span');
    const spanTextHeight  = document.createTextNode('Height: ');
    const pHeightText = document.createTextNode(data.height);
    spanHeight.appendChild(spanTextHeight);
    pHeight.appendChild(spanHeight);
    pHeight.appendChild(pHeightText);

    personDescription.appendChild(pHeight);

    if (data.deathDate != null) {
        const pDeathDay = document.createElement('p');
        const spanDeathDay = document.createElement('span');
        const spanTextDeathDay = document.createTextNode('Death-day: ');
        const pDeathDayText = document.createTextNode(data.deathDate);
        spanDeathDay.appendChild(spanTextDeathDay);
        pDeathDay.appendChild(spanDeathDay);
        pDeathDay.appendChild(pDeathDayText);
        personDescription.appendChild(pDeathDay);
    }

    const pDescription = document.createElement('p');
    pDescription.setAttribute('class', 'movie-plot');
    pDescription.innerHTML = data.summary;
    personDescription.appendChild(pDescription);

    fillExtendedMoviesMediaScroller(data.knownFor,'movie-scroller', 'movie');
}