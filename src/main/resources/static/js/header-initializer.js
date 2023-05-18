const initializeHeader = () => {
    setAuthorizeButton();
}


const setAuthorizeButton = () => {
    if (sessionStorage.getItem('id') != null ) {
        document.getElementById('log-btn').hidden = true;
        const a = document.getElementById('user-button');
        a.hidden = false;
        a.innerHTML = sessionStorage.getItem('name');
    }
}

export default initializeHeader