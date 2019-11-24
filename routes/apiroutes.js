const {OAuth2Client} = require('google-auth-library');
const connection = require('../config/connection')
const client = new OAuth2Client('7917026339-nv3kftq6gd34gr0ipegnjitujib77c4j.apps.googleusercontent.com');
module.exports = function(app) {
   app.post('/api/tokensignin', (req, res) => {
      console.log('hello')
      verify().catch(console.error);
   })
}

async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '7917026339-nv3kftq6gd34gr0ipegnjitujib77c4j.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}