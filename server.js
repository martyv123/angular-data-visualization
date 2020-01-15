// server.js

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
// const Pusher = require('pusher');


const app = express();
const port = process.env.PORT || 4000;

// const pusher = Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_KEY,
//   secret: process.env.PUSHER_SECRET,
//   cluster: 'eu',
// });

let censusData = {
  '14-25':0,
  '25-35':0,
  '35-45':0,
  '45-60':0,
  '60+':0,
};

app.use(bodyParser.json());

app.use(bodyParser.urlencoded( { extended: false } ));

app.use ( (req, res, next) => {
  res.header('Access-Control-Allow-Origin' , '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  next();
});

app.post('/vote', (req, res) => {
  const { body } = req;

  const data = {
      ...body,
    selected: true
  };

  if(body && body.value) {
    censusData[body.value] += 1;
  }

  // console.log('received a vote');
  // console.log(body);
  // console.log(censusData);

  res.json(data);
});

app.get('/censusdata', (req, res) => {
  // const { body } = req;
  // console.log('request for censusdata');
  // console.log(req);

  res.json(censusData);

});

app.get('/sse', (req, res) => {

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'n-cache'
  });
  console.log('server side events');

  setInterval(() => {
    // console.log('writing data sse ');
    // res.write(JSON.stringify(censusData));
    const jsonData = JSON.stringify(censusData);

    res.write(`data: ${jsonData}`);
    res.write('\n\n');
  }, 3000);

});


app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
