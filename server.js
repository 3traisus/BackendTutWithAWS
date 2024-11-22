require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport')
const session = require('express-session');
const multer = require('multer')

/*mercadopago.configure({
    access_token: 'TEST-3411561214482301-102317-b57c8dc7482d96a4263823036dbfba04-501762606'
});*/
/*
IMPORTAR LAS RUTAS
*/
const usersRoutes = require('./routes/userRoutes');
const keys = require('./config/keys');
const categoriesRoutes = require('./routes/categoriesRoutes');
const authRoutes =  require('./routes/authRoutes')
const productsRoutes = require('./routes/productRoutes')
const orders = require('./routes/orderRoutes')
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes')
const stripeRoutes = require('./routes/stripesRoutes')

//const port = process.env.PORT || 3000;
const port = process.env.PORT;
const server_listen =process.env.SERVER_LISTEN


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());

app.use(session({
    secret: keys.secretOrKey, // Debes reemplazar esto con una clave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }  // Asegúrate de cambiar esto a 'true' si usas HTTPS
}));
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.disable('x-powered-by');

app.set('port',port)

const upload = multer({
    storage: multer.memoryStorage()
});
/*
LLAMADO DE LAS RUTAS
*/
usersRoutes(app,upload);
categoriesRoutes(app,upload)
authRoutes(app,upload)
productsRoutes(app,upload)
orders(app,upload)
mercadoPagoRoutes(app,upload)
stripeRoutes(app,upload)


/*server.listen(3000,'192.168.1.101'||'localhost', function(){
    console.log('Aplicacion de NodeJS Iniciada...')
});*/

server.listen(3000, function(){
    console.log('Aplicacion de NodeJS Iniciada...')
});


app.get('/',(req,res)=>{
    res.send('Ruta raiz del backend')
})

app.get('/test',(req,res)=>{
    res.send('Este es la ruta test')
})

//MANEJO DE ERRORES
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(err.status||500).send(err.stack);
})

