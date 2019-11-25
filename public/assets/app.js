document.addEventListener("DOMContentLoaded", function(){
    // Handler when the DOM is fully loaded
    gapi.load('auth2', async function(){
        auth2 = gapi.auth2.init({
            client_id: '7917026339-nv3kftq6gd34gr0ipegnjitujib77c4j.apps.googleusercontent.com'
        })
    })
    
    gapi.load('auth2', async function() {
        auth2 = await gapi.auth2.getAuthInstance({
          client_id: '7917026339-nv3kftq6gd34gr0ipegnjitujib77c4j.apps.googleusercontent.com',
          fetch_basic_profile: true,
          scope: 'profile'
        });
        var signed = await auth2.isSignedIn.get()
        if(signed) {
            signedInSetUp()
        }
        if(!signed) {
            notSignedInSetUp()
        }
    });
});
let isButtonRendered = false;
function renderButton() {
    isButtonRendered = true;
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSignIn,
      'onfailure': onFailure
    });
}
function onFailure(error) {
console.log(error);
}

const goToMyMedFund = () => {
    window.location = 'mymedfund.html'
}

const goToDiscoverMore = () => {
    window.location = '#How'
}
const signInSetUp = () => {
    console.log('hello')
    document.getElementById('SignInBox').style.display = 'flex'
    renderButton()
}

const signedInSetUp = () => {
    document.getElementById('MyMedFundLink').style.display = 'inline-block'
    document.getElementById('ProfileBox').style.display = 'flex'
}

const notSignedInSetUp = () => {
    document.getElementById('SignInLink').style.display = 'inline-block'
    document.getElementById('SignInBox').style.display = 'flex'
    renderButton()
}
var dropList = () => {
    drop = document.getElementById('DropDown')
    if(drop.style.display === 'none' || drop.style.display === '') {
        drop.style.display = 'block'
    }else {
        drop.style.display = 'none'
    }
}
document.addEventListener('mouseup', event => {
    if(event.target != document.getElementById('hc')) {
        document.getElementById('DropDown').style.display = 'none'
    }
})

async function onSignIn(googleUser) {
    document.getElementById('MyMedFundLink').style.display = 'inline-block'
    document.getElementById('SignInLink').style.display = 'none'
    document.getElementById('SignInBox').style.display = 'none'
    // document.getElementById('ProfileLink').style.display = 'inline-block'
    // document.getElementById('SignInLink').style.display = 'none'
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var profile = await googleUser.getBasicProfile();
    const name = await profile.getName()
    const email = await profile.getEmail()
    var id_token = googleUser.getAuthResponse().id_token
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tokensignin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var confirmedToken
    xhr.onload = function() {
        // console.log('Signed in as: ' + xhr.responseText);
        confirmedToken = xhr.responseText
        signInDatabaseWork(confirmedToken, name, email)
    };
    xhr.send('idtoken=' + id_token);
    signedInSetUp()
}

function signOut() {
    document.getElementById('MyMedFundLink').style.display = 'none'
    document.getElementById('SignInLink').style.display = 'inline-block'
    document.getElementById('ProfileBox').style.display = 'none'
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    auth2.disconnect();
    document.getElementById('SignInBox').style.display = 'block'
    if(!isButtonRendered) {
        renderButton()
    }
    clearFields()
}

const signInDatabaseWork = (confirmedToken, name, email) => {
    let user_name
    let user_email
    let user_about
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', '/api/users');
    xhr.onload = function() {
        let isUser = false
        let users = xhr.response.users
        for(i=0;i<users.length;i++) {
            if(users[i].google_id == confirmedToken) {
                isUser = true
                user_name = users[i].user_name
                user_email = users[i].user_email
                user_about = users[i].user_about
            }
        }
        if(isUser) {
            displayUser(user_name, user_email, user_about)
        }
        if(!isUser) {
            addUser(confirmedToken, name, email)
        }
    };
    xhr.send();
}

const addUser = (confirmedToken, name, email) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', '/api/users');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        document.getElementById('NAME').textContent = name
        document.getElementById('EMAIL').textContent = email
    };
    xhr.send('confirmedToken='+confirmedToken + '&name='+name + '&email=' + email);
}

const editProfile = () => {
    document.getElementById('EditProfile').style.display = 'none'
    document.getElementById('SaveChanges').style.display = 'block'
    const statics = document.getElementsByClassName('statics')
    const changers = document.getElementsByClassName('changers')
    const fillers = [statics[0].textContent, statics[1].textContent, statics[2].textContent]

    for(i=0;i<3;i++) {
        statics[i].style.display = 'none'
    }
    for(i=0;i<3;i++) {
        changers[i].style.display = 'inline-block'
        changers[i].value = fillers[i]
    }
}

const clearFields= () => {
    document.getElementById('EditProfile').style.display = 'block'
    document.getElementById('SaveChanges').style.display = 'none'
    const statics = document.getElementsByClassName('statics')
    const changers = document.getElementsByClassName('changers')
    for(i=0;i<3;i++) {
        statics[i].style.display = 'inline-block'
    }
    for(i=0;i<3;i++) {
        changers[i].style.display = 'none'
    }
}

const saveChanges = async () => {
    newName = document.getElementById('NameChange').value
    newEmail = document.getElementById('EmailChange').value
    newAbout = document.getElementById('AboutChange').value
    document.getElementById('EditProfile').style.display = 'block'
    document.getElementById('SaveChanges').style.display = 'none'
    document.getElementById('NAME').style.display = 'inline-block'
    document.getElementById('EMAIL').style.display = 'inline-block'
    document.getElementById('AboutBox').style.display = 'inline-block'
    document.getElementById('NAME').textContent = newName
    document.getElementById('EMAIL').textContent = newEmail
    document.getElementById('AboutBox').textContent = newAbout
    document.getElementById('NameChange').style.display = 'none'
    document.getElementById('EmailChange').style.display = 'none'
    document.getElementById('AboutChange').style.display = 'none'

    updateStart(newName, newEmail, newAbout)
}

const updateStart = async (newName, newEmail, newAbout) => {
    gapi.load('auth2', async function() {
        auth2 = await gapi.auth2.getAuthInstance({
          client_id: '7917026339-nv3kftq6gd34gr0ipegnjitujib77c4j.apps.googleusercontent.com',
          fetch_basic_profile: true,
          scope: 'profile'
        });
        var id = auth2.currentUser.Ab.El
        doTheUpdate(id, newName, newEmail, newAbout)
    });
}

const doTheUpdate = (id, newName, newEmail, newAbout) => {
    console.log(id, newName, newEmail, newAbout)
    // var xhr = new XMLHttpRequest();
    // xhr.responseType = 'json';
    // xhr.open('POST', '/api/users');
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xhr.onload = function() {
    //     document.getElementById('NAME').textContent = name
    //     document.getElementById('EMAIL').textContent = email
    // };
    // xhr.send('confirmedToken='+confirmedToken + '&name='+name + '&email=' + email);
}

const displayUser = (name, email, about) => {
    document.getElementById('NAME').textContent = name
    document.getElementById('EMAIL').textContent = email
    document.getElementById('AboutBox').textContent = about
}


