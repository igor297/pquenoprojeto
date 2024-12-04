function logout() {
    localStorage.removeItem('token_fac');
    location.href = '../login.html'
}

function verificaAutenticacao() {
    if(localStorage.getItem('token_fac') == null) {
        location.href = '../login.html'
    }
}
