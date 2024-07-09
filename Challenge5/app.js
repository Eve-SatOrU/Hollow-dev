const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const session = require('express-session');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');




// app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
// Routes
const userRuotes=require('./routes/routes');
const directoryRoutes = require('./routes/directory');  
// const fileRoutes = require('./routes/file');
const metricsRoutes = require('./routes/metrics'); 
const servicesRoutes = require('./routes/services');
app.use('/',userRuotes)
app.use('/directory', directoryRoutes);
// app.use('/file', fileRoutes);
app.use('/metrics', metricsRoutes);
app.use('/services', servicesRoutes);


app.use(express.json());


//db
const User = require('./models/user');  

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.use(limiter);
 


 sequelize.sync().then(() => { 
// sequelize.sync({ force: true }).then(() => {
  app.listen(3001, () => { 
    console.log('Server started on port 3000');
  });
}).catch(error => console.log(error));