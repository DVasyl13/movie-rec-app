const watchedBtn = document.getElementById('watched');
const likedBtn = document.getElementById('liked');
const ignoredBtn = document.getElementById('ignored');

window.onload = () => {

}



watchedBtn.addEventListener('click', () => {
    document.getElementById('section-name').innerHTML = 'Your watched:';

});

likedBtn.addEventListener('click', () => {
    document.getElementById('section-name').innerHTML = 'Your liked:';

});

ignoredBtn.addEventListener('click', () => {
    document.getElementById('section-name').innerHTML = 'Your ignored:';

});