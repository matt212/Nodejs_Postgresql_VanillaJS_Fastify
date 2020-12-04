// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': 'your-secret-clientID-here', // your App ID
        'clientSecret': 'your-client-secret-here', // your App Secret
        'callbackURL': 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth': {
        'consumerKey': 'your-consumer-key-here',
        'consumerSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': '988483761522-bi3dguc9r2hk5d8aqdstn7l9aqt1b7l7.apps.googleusercontent.com',
        'clientSecret': 'oT7ZC08SCVQAnmm5mrKDLsPw',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }

};