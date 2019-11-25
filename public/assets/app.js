import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

let isButtonRendered = false;
function onFailure(error) {
console.log(error);
}
const signInSetUp = () => {
    console.log('hello')
    document.getElementById('SignInBox').style.display = 'flex'
    renderButton()
}
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
}

const signInDatabaseWork = (confirmedToken, name, email) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', '/api/users');
    xhr.onload = function() {
        let isUser = false
        let users = xhr.response.users
        for(i=0;i<users.length;i++) {
            if(users[i].google_id == confirmedToken) {
                isUser = true
            }
        }
        if(isUser) {

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
    const statics = document.getElementsByClassName('statics')
    const changers = document.getElementsByClassName('changers')
    const fillers = [statics[0].textContent, statics[1].textContent]
    for(i=0;i<2;i++) {
        statics[i].style.display = 'none'
    }
    for(i=0;i<2;i++) {
        changers[i].style.display = 'inline-block'
    }
}
