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
app.use((req, res, next) => {
    const allowedOrigins = ['https://tebusco.vercel.app', 'https://tebuscoar.vercel.app']
    const origin = req.headers.origin

    if (allowedOrigins.includes(origin)) {
        // Si la solicitud viene de 'tebusco.vercel.app', permite todos los métodos
        if (origin === 'https://tebusco.vercel.app') {
            cors({
                origin: origin,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
            })(req, res, next)
        }
        // Si la solicitud viene de 'tebuscoar.vercel.app', solo permite POST
        else if (origin === 'https://tebuscoar.vercel.app') {
            cors({
                origin: origin,
                methods: ['POST'],
                allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
            })(req, res, next)
        }
    } else {
        // Si el origen no está permitido, bloquea la solicitud
        res.status(403).send('CORS policy: Origin not allowed')
    }
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