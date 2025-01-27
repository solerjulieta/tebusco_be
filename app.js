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
app.use(cors())
//app.use('/icons', express.static(path.join(__dirname, 'public/icons')))

app.use('/', PassengersApiRoute)
app.use('/', DriversApiRoute)
app.use('/', AffiliationsApiRoute)
app.use('/', CitiesApiRoute)
app.use('/', ProvincesApiRoute)
app.use('/', VehiclesApiRoute)

const PORT = process.env.MONGO_URI || 3000

app.listen(PORT, () => {
    console.log(`El servidor se está ejecutando... http://localhost:${PORT}`)
})