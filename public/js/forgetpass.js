const emailpassresetinput = document.querySelector('.emailpassresetinput');
const confirmemailbtn = document.querySelector('.confirmemailbtn');
const emailpassreseterr = document.querySelector('.emailpassreseterr');
let founduserid;

const confiremail = document.querySelector('.confiremailbox');
const resetpassword = document.querySelector('.resetpasswordbox');

const passwordresetinput = document.querySelector('.passwordresetinput');
const passwordresetbtn = document.querySelector('.passwordresetbtn');
const passwordreseterr = document.querySelector('.passwordreseterr');
const passwordresetdone = document.querySelector('.passwordresetdone')

confirmemailbtn.addEventListener('click', async () => {

    emailpassreseterr.textContent = '';
    const email = emailpassresetinput.value;
    try {
        const res = await fetch('/forgetpassemail', { 
            method: 'POST', 
            body: JSON.stringify({ email }),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();
        if (data.errors) {
            emailpassreseterr.textContent = data.errors.email;
        }
        if (data.id) {
            founduserid = data.id;
            confiremail.style.display ='none';
            resetpassword.style.display ='block';

            passwordresetbtn.addEventListener('click', async () => {

                passwordreseterr.textContent = '';
                const newpassword = { password: passwordresetinput.value} ;
                try {
                    const res = await fetch(`/resetpass/${founduserid}`, { 
                        method: 'PATCH', 
                        body: JSON.stringify( newpassword ),
                        headers: {'Content-Type': 'application/json'}
                    });
                    const data = await res.json();
                    if (data.errors) {
                        passwordreseterr.textContent = data.errors.password;
                    }
                    if (data.id) {
                        confiremail.style.display ='none';
                        resetpassword.style.display ='none';
                        passwordresetdone.style.display ='block';
                    }
                }
                catch (err) {
                    console.log(err);
                }
            });
        }
    }
    catch (err) {
        console.log(err);
    }

});

