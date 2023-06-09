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
        document.getElementById("user-birthday").valueAsDate = new Date(data.birthday);
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


$(document).on("click", "#log-out-btn", function () {
    sessionStorage.clear()
    window.location.href = "/";
});

let changedFields = new Map();

$(".user-input-element input").on("change keyup paste", function () {
    const elem = $(this);
    console.log(elem.val());
    changedFields.set(elem.attr("id").substring(elem.attr("id").indexOf('-') + 1), elem.val());
})

$('#user-submit-button').on("click", function () {
    if (changedFields.size !== 0) {
        const settings = {
            id: sessionStorage.getItem("id"),
            username: changedFields.get("username"),
            email: changedFields.get("email"),
            password: changedFields.get("password"),
            country: changedFields.get("country"),
            birthday: changedFields.get("birthday"),
            oldpassword: sessionStorage.getItem('password')
        }
        console.log(settings);
        saveUserChanges(settings);
    }
});

async function saveUserChanges(data) {
    try {
        const settings = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        const response = await fetch('/api/v1/user/account', settings);
        const responseBody = await response.json();
        console.log(responseBody);
        for (let [key, value] of changedFields) {
            sessionStorage.setItem(key, value);
            console.log(key);
            console.log(sessionStorage.getItem(key));
        }
        location.reload();
    } catch (e) {
        console.error("Error: " + e);
    }
}