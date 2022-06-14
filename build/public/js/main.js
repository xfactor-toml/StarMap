function showAvatar() {
  document.querySelector('#showedAvatar').style.left = '0vw'; document.querySelector('#showedAvatar').classList.add('showedAvatar'); document.querySelector('#showedAvatar').classList.remove('hiddenAvatar');
  setTimeout(() => {document.querySelector('#showedAvatar').style.opacity = '1'}, 300)
}

function hiddenAvatar() {
  document.querySelector('#showedAvatar').classList.remove('showedAvatar');document.querySelector('#showedAvatar').classList.add('hiddenAvatar'); setTimeout(() => {document.querySelector('#showedAvatar').style.opacity = '0'}, 500);
}