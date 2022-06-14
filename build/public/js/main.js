function showAvatar() {
    document.querySelector('#showedAvatar').style.left = `${Math.trunc(Math.random() * 1000)}px`;
    document.querySelector('#showedAvatar').style.top = `${Math.trunc(Math.random() * 400)}px`;
    document.querySelector('#showedAvatar').classList.add('showedAvatar');
    document.querySelector('#showedAvatar').classList.remove('hiddenAvatar');
    setTimeout(() => { document.querySelector('#showedAvatar').style.opacity = '1' }, 300)
}

function hiddenAvatar() {
    document.querySelector('#showedAvatar').classList.remove('showedAvatar');
    document.querySelector('#showedAvatar').classList.add('hiddenAvatar');
    setTimeout(() => { document.querySelector('#showedAvatar').style.opacity = '0' }, 500);
}