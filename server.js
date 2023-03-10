const path = require('path');
const express = require('express');
const { logger } = require('./middleware/logEvent');
const cors = require('cors');
const app = express();
//initialize object
const PORT = process.env.PORT || 3500;
//custom middleware logger
app.use(logger);

//Cross origin resource sharing
const whiteList = ['https://www.google.com', 'http://localhost:3500'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

// build-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('^/$|/index(.html)?', (req, res) => {
  // res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});
app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, './new-page.html');
});
//Routes Handler
app.get(
  '/hello(.html)?',
  (req, res, next) => {
    console.log('Load hello.html');
    next();
  },
  (req, res) => {
    res.send('Hello World!');
  }
);

app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});
app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
