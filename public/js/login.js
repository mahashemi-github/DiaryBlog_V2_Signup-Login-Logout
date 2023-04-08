const formlo = document.querySelector('.formlo');
const emailErrorlo = document.querySelector('.emaillo.error');
const passwordErrorlo = document.querySelector('.passwordlo.error');

formlo.addEventListener('submit', async (e) => {
    e.preventDefault();

    emailErrorlo.textContent = '';
    passwordErrorlo.textContent = '';

    const email = formlo.email.value;
    const password = formlo.password.value;

    try {
      const res = await fetch('/login', { 
          method: 'POST', 
          body: JSON.stringify({ email, password }),
          headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
      console.log(data);
      if (data.errors) {
          emailErrorlo.textContent = data.errors.email;
          passwordErrorlo.textContent = data.errors.password;
      }
      if (data.user) {
          location.assign('/');
      }
    }
    catch (err) {
        console.log(err);
    }

});