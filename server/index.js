const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `${__dirname}/controllers/messages_controller` );
const sessionSecret = require('./config');
const app = express();
const session = require('express-session');
const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use(session({
    secret: sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge: 10000}
}));
app.use((req,res,next)=>{
    createInitialSession(req,res,next);
})

app.use((req,res,next)=>{
    if(req.method==="PUT"||req.method==='POST'){
        filter(req,res,next);
    } else{
        next();
    }
});

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get(`${messagesBaseUrl}/history`,mc.history);

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );