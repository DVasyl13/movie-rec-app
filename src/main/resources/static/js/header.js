const searchBar = document.querySelector('.search-bar input');
const dropDownMenu = document.querySelector(".dropdown-menu");
const apiKey = 'k_h5a19iwm';
let typingTimer;
const typingDelay = 1000; // milliseconds delay after user stops typing

searchBar.addEventListener('input', () => {
    if (searchBar.value.length > 0) {
        dropDownMenu.style.display = 'block';
        search();
    } else {
        dropDownMenu.style.display = 'none';
    }
});
searchBar.addEventListener('input', function (event) {
    if (searchBar.value.length > 0) {
        dropDownMenu.style.display = 'block';
        clearTimeout(typingTimer);
        typingTimer = setTimeout(search, typingDelay);
    } else {
        dropDownMenu.style.display = 'none';
    }
});
async function search() {
    const inputValue = searchBar.value.trim();
    console.log('Processing search for:', inputValue);
    try {
        const response = await fetch('https://imdb-api.com/en/API/Search/' + apiKey + '/' + inputValue);
        const responseBody = await response.json();
        const ul = createDropDownMenu();
        populateDropdownSearchMenu(responseBody, ul);
    } catch (e) {
        console.log("Error: " + e);
    }
}
function createDropDownMenu() {
    dropDownMenu.innerHTML = "";
    const ul = document.createElement("ul");
    ul.setAttribute("class", "dropdown-menu-ul");
    dropDownMenu.appendChild(ul);
    return ul;
}
function populateDropdownSearchMenu(data, ul) {
    const maxElementsInSearch = 6;
    const movies = data.results;
    for (let i = 0; i < maxElementsInSearch; i++) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = '/movie/' + movies[i].id;

        const searchedElement = document.createElement("div");
        searchedElement.setAttribute("class", "searched-element");

        const searchedElementContent = document.createElement("div");
        searchedElementContent.setAttribute("class", "searched-element-content");

        const title = document.createElement("p");
        title.setAttribute("class", "sec-title");
        title.innerHTML = movies[i].title;

        const description = document.createElement("p");
        description.setAttribute("class", "sec-description");
        description.innerHTML = movies[i].description;

        const img = document.createElement("img");
        img.src = movies[i].image;
        img.alt = movies[i].title + ".img"
        searchedElementContent.appendChild(title);
        searchedElementContent.appendChild(description);
        searchedElement.appendChild(searchedElementContent);
        searchedElement.appendChild(img);
        a.appendChild(searchedElement);
        li.appendChild(a);
        ul.appendChild(li);
    }
}



const loginBtn = document.querySelector(".log-btn");
const regBtn = document.getElementById("registration-popup-button");

const closeLoginFormBtn = document.getElementById("close-login-button");
const closeRegistrationFormBtn = document.getElementById("close-registration-button");

const loginFormPopUpButton = document.getElementById("login-form-button");
const createAccountButton = document.getElementById('create-account-button');
const loginPopupButton = document.getElementById('login-popup-button');

const shadowBG = document.getElementById("background-popup");
const controlDisapearingBG = (flag) => {
    (flag)
        ? shadowBG.style.visibility = "visible"
        : shadowBG.style.visibility = "hidden";
}

createAccountButton.addEventListener('click', () => {
    resisterNewUser();
});

loginPopupButton.addEventListener('click', () => {
    loginUser();
});

loginBtn.addEventListener('click', () => {
    document.querySelector(".login-popup").classList.add("active");
    document.querySelector(".registration-popup").classList.remove("active");
    controlDisapearingBG(1);
});

regBtn.addEventListener('click', () => {
    document.querySelector(".login-popup").classList.remove("active");
    document.querySelector(".registration-popup").classList.add("active");
});
closeLoginFormBtn.addEventListener('click', () => {
    document.querySelector(".login-popup").classList.remove("active");
    document.querySelector(".registration-popup").classList.remove("active");
    controlDisapearingBG(0);
});
closeRegistrationFormBtn.addEventListener('click', () => {
    document.querySelector(".login-popup").classList.remove("active");
    document.querySelector(".registration-popup").classList.remove("active");
    controlDisapearingBG(0);
});
shadowBG.addEventListener('click', () => {
    document.querySelector(".login-popup").classList.remove("active");
    document.querySelector(".registration-popup").classList.remove("active");
    controlDisapearingBG(0);
})

loginFormPopUpButton.addEventListener('click', () => {
    document.querySelector(".login-popup").classList.add("active");
    document.querySelector(".registration-popup").classList.remove("active");
    controlDisapearingBG(1);
});

const resisterNewUser = () => {
    const label = document.getElementById('registration-label');

    const username = document.getElementById('registration-name').value;
    const email = document.getElementById('registration-email').value;
    const password = document.getElementById('registration-password').value;
    const dubpassword = document.getElementById('repeat-password').value;
    if (username === '' || email === '' || password === '' || dubpassword === '') {
        label.innerHTML = '*Заповніть всі поля!';
        return;
    }
    else {
        label.innerHTML = '';
    }
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(mailFormat.test(email)) {
        label.innerHTML = '';
    }
    else {
        label.innerHTML = '*Цей формат емейлу не відповідає нормам!';
        return;
    }

    if (password !== dubpassword) {
        label.innerHTML = '*Введені паролі не збігаються!';
        return;
    } else {
        label.innerHTML = '';
    }

    const data = {
        username: username,
        email: email,
        password: password
    }
    createNewUser(data);
}

const createNewUser = (data) => {
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setUserData(data, data.password);
            removePopUps();
        })
        .catch(error => {
            document.getElementById('registration-label').innerHTML='*Цей email вже зайнято!';
            console.error('Error:', error);
        });
}

const loginUser = () => {
    const label = document.getElementById('login-label');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        label.innerHTML = '*Заповніть всі поля!';
        return ;
    }
    else {
        label.innerHTML = '';
    }
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(mailFormat.test(email)) {
        label.innerHTML = '';
    }
    else {
        label.innerHTML = '*Цей формат емейлу не відповідає нормам!';
        return false;
    }
    const data = {
        email: email,
        password: password
    }
    verifyUser(data);
}

const verifyUser = (input) => {
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('login-label').innerHTML='';
            setUserData(data, input.password);
            removePopUps();
        })
        .catch(error => {
            document.getElementById('login-label').innerHTML='*Перевірте введені вами поля!';
            console.error('Error:', error);
        });

}

const setUserData = (response, password) => {
    sessionStorage.setItem('id', response.data.id);
    sessionStorage.setItem('name', response.data.name);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('email', response.data.email);
    location.reload();
}

const removePopUps = () => {
    document.querySelector(".login-popup").classList.remove("active");
    document.querySelector(".registration-popup").classList.remove("active");
    controlDisapearingBG(0);
}