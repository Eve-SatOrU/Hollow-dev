const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const setupSwagger = require('./swagger');


const upload = require('multer')();
app.use(upload.single('imageData'));


// app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('public'));
app.use(cors());
app.use(express.json());
// Set up middleware
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
 

const userRouter = require('./routes/user');
const candidateRouter = require('./routes/candidate');
const voteRouter = require('./routes/vote');

app.use('/users', userRouter);
app.use('/candidates', candidateRouter);
app.use('/votes', voteRouter);


app.use(express.json());



app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});

app.use(limiter);
setupSwagger(app);
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = 3000 || process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});