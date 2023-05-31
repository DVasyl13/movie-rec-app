const groupSize = 6;

function fillMovieMediaScroller(data,selector, groupName) {
    const mediaScroller = document.getElementById(selector);
    let index = 0;
    let groupIndex = 1;
    for (let i = 0; i < Math.ceil(data.length / groupSize); i++) {
        const group = document.createElement('div');
        group.setAttribute('class', 'media-group');
        group.setAttribute('id', ''+ groupName + '-group-' + groupIndex);
        if (index !== 0) {
            createScrollTag(groupIndex, group, 'groupName', 'previous');
        }
        for (let j = 0; j < groupSize && index < data.length; j++, index++) {
            const a = document.createElement('a');
            a.href = '/movie/' + data[index].id;

            const mediaElement = document.createElement('div');
            mediaElement.setAttribute('class', 'media-element');

            const img = document.createElement('img');
            img.src = data[index].image;
            img.alt = data[index].title + '.png';
            mediaElement.appendChild(img);
            a.appendChild(mediaElement);
            group.appendChild(a);
        }
        if (index < data.length) {
            createScrollTag(groupIndex, group, groupName, 'next');
        }
        groupIndex++;
        mediaScroller.appendChild(group);
    }
    const navigation = document.createElement('div');
    navigation.setAttribute('class', 'navigation-indicators');
    for (let i = 0; i < groupIndex - 1; i++) {
        navigation.appendChild(document.createElement('div'));
    }
    mediaScroller.appendChild(navigation);
}

function fillCastMediaScroller(data, groupName) {
    const mediaScroller = document.getElementById('cast-scroller');
    let index = 0;
    let groupIndex = 1;
    for (let i = 0; i < Math.ceil(data.length / groupSize); i++) {
        const group = document.createElement('div');
        group.setAttribute('class', 'media-group');
        group.setAttribute('id', groupName+'-group-' + groupIndex);
        if (index !== 0) {
            createScrollTag(groupIndex, group, groupName, 'previous');
        }
        for (let j = 0; j < groupSize && index < data.length; j++, index++) {
            const a = document.createElement('a');
            a.href = '/person/' + data[index].id;

            const mediaElement = document.createElement('div');
            mediaElement.setAttribute('class', 'media-element');

            const img = document.createElement('img');
            img.src = data[index].image;
            img.alt = data[index].name + '.png';
            const p = document.createElement('p');
            p.innerHTML = data[index].name;
            mediaElement.appendChild(img);
            mediaElement.appendChild(p)
            a.appendChild(mediaElement);
            group.appendChild(a);
        }
        if (index < data.length) {
            createScrollTag(groupIndex, group, groupName, 'next');
        }
        groupIndex++;
        mediaScroller.appendChild(group);
    }
    const navigation = document.createElement('div');
    navigation.setAttribute('class', 'navigation-indicators');
    for (let i = 0; i < groupIndex - 1; i++) {
        navigation.appendChild(document.createElement('div'));
    }
    mediaScroller.appendChild(navigation);
}

function fillExtendedMoviesMediaScroller(data, selector, groupName) {
    const mediaScroller = document.getElementById(selector);
    let index = 0;
    let groupIndex = 1;
    for (let i = 0; i < Math.ceil(data.length / groupSize); i++) {
        const group = document.createElement('div');
        group.setAttribute('class', 'media-group');
        group.setAttribute('id', ''+groupName+'-group-' + groupIndex);
        if (index !== 0) {
            createScrollTag(groupIndex, group, groupName, 'previous');
        }
        for (let j = 0; j < groupSize && index < data.length; j++, index++) {
            const a = document.createElement('a');
            a.href = '/movie/' + data[index].id;

            const mediaElement = document.createElement('div');
            mediaElement.setAttribute('class', 'media-element');

            const img = document.createElement('img');
            img.src = data[index].image;
            img.alt = data[index].title + '.png';
            const div = document.createElement('div');
            div.setAttribute('class', 'description-centered');
            const p = document.createElement('p');
            p.innerHTML = data[index].title;
            mediaElement.appendChild(img);
            div.appendChild(p);
            mediaElement.appendChild(div);
            a.appendChild(mediaElement);
            group.appendChild(a);
        }
        if (index < data.length) {
            createScrollTag(groupIndex, group, groupName, 'next');
        }
        groupIndex++;
        mediaScroller.appendChild(group);
    }
    const navigation = document.createElement('div');
    navigation.setAttribute('class', 'navigation-indicators');
    for (let i = 0; i < groupIndex - 1; i++) {
        navigation.appendChild(document.createElement('div'));
    }
    mediaScroller.appendChild(navigation);
}

function createScrollTag(groupIndex, group, groupName, direction) {
    const a = document.createElement('a');
    a.setAttribute('class', direction);
    const span = document.createElement('span');
    span.setAttribute('class', "material-symbols-outlined");

    if (direction === 'previous') {
        a.href = '#' + groupName + '-group-' + (groupIndex - 1);
        span.innerHTML = 'arrow_back_ios';
    } else {
        a.href = '#' + groupName + '-group-' + (groupIndex + 1);
        a.setAttribute('aria-label', direction);
        span.innerHTML = 'arrow_forward_ios';
    }
    a.appendChild(span);
    group.appendChild(a);
}

export {fillCastMediaScroller, fillMovieMediaScroller, fillExtendedMoviesMediaScroller}