const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3001;

const accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const apiKeySid = process.env.API_KEY_SID;  // Your API Key SID from www.twilio.com/console
const apiKeySecret = process.env.API_KEY_SECRET;  // Your API Key Secret from www.twilio.com/console

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to generate Twilio token
app.get('/token', (req, res) => {
  const identity = 'kmendez@gurunet.biz';  // Replace with the identity of the user (could be dynamic)

  console.log("accountSid: ", accountSid)
  console.log("apiKeySid: ", apiKeySid)
  console.log("apiKeySecret: ", apiKeySecret)
  console.log("process.env.TWIML_APP_SID: ", process.env.TWIML_APP_SID)

  const voiceGrant = new twilio.jwt.AccessToken.VoiceGrant({
    outgoingApplicationSid: process.env.TWIML_APP_SID,  // Your TwiML App SID
    incomingAllow: true  // Allow incoming calls
  });

  console.log("voiceGrant: ", voiceGrant);

  const token = new twilio.jwt.AccessToken(accountSid, apiKeySid, apiKeySecret,{identity: identity});
  token.addGrant(voiceGrant);

  console.log("token: ", token);

  console.log("token.toJwt(): ", token.toJwt());

  res.send({ token: token.toJwt() });
});

// Route to handle the TwiML response
app.post('/voice', (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  console.log("req: ", req);
  console.log("req.user.name: ", req.user.name)
  const dial = twiml.dial({
    callerId: '+14239273988' // Use the authenticated user's name as callerId
  });
  dial.number('+50686081422');


  res.type('text/xml');
  console.log('twiml.toString(): ', twiml.toString());
  res.send(twiml.toString());
});

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
