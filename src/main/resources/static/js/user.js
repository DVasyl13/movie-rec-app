
window.onload = () => {
    checkIfAuthorized();
    initializeHeader();
    initFields();
}

async function initFields() {
    const data = {
        id: sessionStorage.getItem("id"),
        password: sessionStorage.getItem("password")
    };

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };

    const response = await fetch('/api/v1/user', settings);
    const responseBody = await response.json();
    console.log(responseBody)
    setUserDetails(responseBody.data);
}

function setUserDetails(data) {
    //TODO: birthday not working
    document.getElementById("user-username").placeholder = data.username;
    document.getElementById("user-email").placeholder = data.email;
    if (data.country !== null) {
        document.getElementById("user-country").placeholder = data.country;
    }
    if (data.birthday !== null) {
        document.getElementById("user-birthday").placeholder = data.birthday;
    }
    document.getElementById("user-password").placeholder = "*".repeat(sessionStorage.getItem("password").length);
}

function checkIfAuthorized() {
    if (sessionStorage.getItem('id') == null) {
        initNotAuthorizedPage();
    }
}

function initNotAuthorizedPage() {
    const container = document.getElementById('main-container');
    $(container).empty();
    const p = document.createElement('p');
    p.setAttribute('class', 'medium-text');
    p.innerHTML = 'It seems you are not authorized';
    container.appendChild(p);
}

function initializeHeader() {
    document.getElementById('log-btn').hidden = true;
    document.getElementById('user-button').hidden = true;

    const logOutBtn = document.createElement('button');
    logOutBtn.setAttribute('class', 'log-btn');
    logOutBtn.setAttribute('id', 'log-out-btn');
    logOutBtn.innerHTML = 'Log out';
    document.getElementById('header-navigation').appendChild(logOutBtn);
}


$(document).on("click", "#log-out-btn", function(){
    sessionStorage.clear()
    window.location.href = "/";
});