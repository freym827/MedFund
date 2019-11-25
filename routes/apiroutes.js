const {OAuth2Client} = require('google-auth-library');
const connection = require('../config/connection')
const client = new OAuth2Client('7917026339-nv3kftq6gd34gr0ipegnjitujib77c4j.apps.googleusercontent.com');
module.exports = function(app) {

    app.get('/api/users', (req, res) => {
        connection.query('SELECT * FROM users', (err, data) => {
            err?res.send(err):res.json({users: data})
        })
    })

    app.post('/api/users/update', (req, res) => {
        const query = "update users set user_name = '" + req.body.name + "', user_email = '" + req.body.email + "', user_about = '" + req.body.about + "' where google_id = '" + req.body.google_id + "';"
        console.log(query)
        connection.query(query, (err, data) => {
            err?res.send(err):res.json({users: data})
        })
    })

    app.post('/api/users', (req, res) => {
        const query = "insert into users (google_id, user_name, user_email) values ('" + req.body.confirmedToken + "', '" + req.body.name + "', '" + req.body.email + "');"
        connection.query(query, (err, data) => {
            err?res.send(err):res.json({users: data})
        })
    })
   
    app.post('/api/tokensignin', async (req, res) => {
        const userid = await verify(req.body.idtoken)
        res.send(userid)
    })
}

async function verify(token) {
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
    return userid;
}