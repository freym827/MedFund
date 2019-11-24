
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
    document.getElementById('MyMedFund').style.display = 'inline-block'
}

const notSignedInSetUp = () => {
    document.getElementById('SignIn').style.display = 'inline-block'
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

function onSignIn(googleUser) {
    document.getElementById('MyMedFund').style.display = 'inline-block'
    document.getElementById('SignIn').style.display = 'none'
    // document.getElementById('ProfileLink').style.display = 'inline-block'
    // document.getElementById('SignInLink').style.display = 'none'
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tokensignin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('Signed in as: ' + xhr.responseText);

    };
    xhr.send('idtoken=' + id_token);
}

function signOut() {
    document.getElementById('MyMedFund').style.display = 'none'
    document.getElementById('SignIn').style.display = 'inline-block'
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}