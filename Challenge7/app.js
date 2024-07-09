let express = require( 'express' );
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './controllers/stream' );
let path = require( 'path' );

app.set( 'view engine', 'pug' );
app.set( 'views', path.join( __dirname, 'views' ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );


const routes = require('./routes/routes');
app.use('/', routes);

io.of( '/stream' ).on( 'connection', stream );

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
  });


server.listen( 3000,()=>{
    console.log('Server is running on port 3000');
} );