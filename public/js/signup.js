const formsi = document.querySelector('.formsi');
const usernameErrorsi = document.querySelector('.usernamesi');
const emailErrorsi = document.querySelector('.emailsi');
const passwordErrorsi = document.querySelector('.passwordsi');

formsi.addEventListener('submit', async (e) => {
    e.preventDefault();

    emailErrorsi.textContent = '';
    passwordErrorsi.textContent = '';

    const username = formsi.username.value;
    const email = formsi.email.value;
    const password = formsi.password.value;

    try {
        const res = await fetch('/signup', { 
            method: 'POST', 
            body: JSON.stringify({ username, email, password }),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();
        console.log(data);
        if (data.errors) {
            usernameErrorsi.textContent = data.errors.username;
            emailErrorsi.textContent = data.errors.email;
            passwordErrorsi.textContent = data.errors.password;
        }
        if (data.user) {
            location.assign('/');
        }
    }
    catch (err) {
        console.log(err);
    }

});