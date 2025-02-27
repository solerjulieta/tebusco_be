import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import PassengersApiRoute from './api/routes/passengers.api.routes.js'
import DriversApiRoute from './api/routes/drivers.api.routes.js'
import AffiliationsApiRoute from './api/routes/affiliations.api.routes.js'
import CitiesApiRoute from './api/routes/cities.api.routes.js'
import ProvincesApiRoute from './api/routes/provinces.api.routes.js'
import VehiclesApiRoute from './api/routes/vehicles.api.routes.js'
import ContactApiRoute from './api/routes/contact.api.routes.js'

dotenv.config() 

const app = express() 
app.set('view engine', 'ejs') 

// Obtener el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//app.use(express.static('public')) 
// Exponer solo los directorios específicos
app.use('/uploads/drivers/profile', express.static(path.join(__dirname, 'public/uploads/drivers/profile')));
app.use('/uploads/passengers/profile', express.static(path.join(__dirname, 'public/uploads/passengers/profile')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
/* 24/02
app.use(cors({
    origin: 'https://tebusco.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
}))*/

// Middleware de CORS con configuración dinámica
const corsOptions = (req, callback) => {
    const allowedOrigins = {
        'https://tebusco.vercel.app': ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        'https://tebuscoar.vercel.app': ['POST'] // Solo POST para este
    };

    const origin = req.header('Origin');
    if (!origin || !allowedOrigins[origin]) {
        return callback(new Error('CORS policy: Origin not allowed'), false);
    }

    callback(null, {
        origin: true,
        methods: allowedOrigins[origin], 
        allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
    });
};

app.use(cors(corsOptions));

// Middleware específico para controlar los métodos permitidos
app.use((req, res, next) => {
    const origin = req.headers.origin
    if (origin === 'https://tebuscoar.vercel.app') {
        // Solo permite el método POST para este origen
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed')
        }
    }
    next() // Si el método es permitido, continúa con la siguiente ruta
})

app.use('/', PassengersApiRoute)
app.use('/', DriversApiRoute)
app.use('/', AffiliationsApiRoute)
app.use('/', CitiesApiRoute)
app.use('/', ProvincesApiRoute)
app.use('/', VehiclesApiRoute)
app.use('/', ContactApiRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`El servidor se está ejecutando... http://localhost:${PORT}`)
})