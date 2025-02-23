import * as driverService from '../../services/drivers.service.js'
import * as accountService from '../../services/account.service.js'
import * as tokenService from '../../services/token.service.js'
import * as reviewService from '../../services/reviews.service.js'
import * as tripService from '../../services/trips.service.js'
import * as passengerService from '../../services/passengers.service.js'

async function getAll(req, res)
{
    const filter = {}

    driverService.getAll(filter)
        .then(function(drivers){
            res.status(200).json(drivers)
        })
}

async function getById(req, res)
{
    const id = req.params.id

    driverService.getById(id)
        .then(function(driver){
            if(driver){
                res.status(200).json(driver)
            } else {
                res.status(404).json({ error: { msg: 'Transportista no encontrado.' } })
            }
        })
}

async function getProfile(req, res)
{
    driverService.getProfile(req.account._id)
        .then(function(profile){
            if(profile){
                res.status(200).json(profile)
            } else {
                res.status(404).json({ error: { msg: err.message } })
            }
        })
}

async function editProfile(req, res)
{
    const id = req.params.id
    const data = req.body

    const validFields = ['name', 'lastname', 'phone', 'about', 'affiliations', 'workingSince']
    const updateData = {}

    validFields.forEach(field => {
        if(data[field] !== undefined){
            updateData[field] = data[field]
        }
    })

    driverService.editProfile(id, updateData)
        .then(() => {
            res.status(200).json({ msg: 'Perfil actualizado.' })
        })
        .catch((err) => {
            res.status(500).json({ error: { msg: err.message } })
        })
}

async function getReviews(req, res)
{
    const id = req.params.id

    reviewService.getByDriverId(id)
        .then(function (reviews){
            if(reviews){
                res.status(200).json(reviews)
            } else {
                res.status(200).json({ reviews: [] })
            }
        })
}

async function uploadAvatar(req, res)
{
    const id = req.params.id
    const avatar = req.file.originalname

    if(!avatar){
        return res.status(400).json({ error: { msg: 'No se cargó ninguna imagen.' } })
    }

    driverService.uploadAvatar(id, avatar)
        .then(() => {
            res.status(200).json({ msg: 'Foto de perfil actualizada.', filename: avatar})
        })
        .catch((err) => {
            res.status(500).json({ error: { msg: err.message } })
        })
}

async function register(req, res)
{
    const account = {
        email: req.body.email,
        password: req.body.password,
        roles: ['transportista'],
    }

    let affiliations = req.body.affiliations;

    // Verifica si affiliations es un array y si está vacío o es undefined
    if (!Array.isArray(affiliations) || affiliations.length === 0) {
        affiliations = ["particular"];
    }

    const profileData = {
        //avatar: null,
        name: req.body.name,
        lastname: req.body.lastname,
        dni: req.body.dni,
        authorization: req.file.originalname,
        affiliations: req.body.affiliations,
        phone: req.body.phone,
        city: req.body.city,
        province: req.body.province,
        created_at: req.body.created_at
    }

    accountService.register(account)
        .then((newAccount) => {
            return driverService.createProfile(newAccount, profileData)
        })
        .then((newAcc) => {
            res.status(201).json({ msg: 'Se ha registrado correctamente.', newAcc: newAcc })
        })
        .catch((err) => {
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function getPublicPassengerById(req, res)
{
    const id = req.params.id

    passengerService.getProfile(id)
        .then(passenger => {
            if(!passenger){
                return res.status(404).json({ msg: 'Pasajero no encontrado.' })
            }

            return tripService.getByPassengerId(id)
            .then(trip => {
                passenger.trip = trip
                res.status(200).json(passenger)
            })
            .catch(err => {
                res.status(200).json(passenger)
                //res.status(400).json({ error: { msg: err.message } })
            })
        })
}

async function login(req, res)
{
    return accountService.login(req.body, req.expectedRole)
        .then(async (account) => {
            return { token: await tokenService.create(account), account }
        })
        .then((auth) => {
            res.status(201).json(auth)
        })
        .catch((err) => {
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function logout(req, res)
{
    const token = req.headers['auth-token']

    return tokenService.remove(token)
        .then(() => {
            res.status(200).json({ msg: 'Sesión cerrada correctamente.' })
        })
        .catch((err) => {
            res.status(400).json({ error: {msg: err.message} })
        })
}

export{
    getAll,
    getById,
    getProfile,
    editProfile,
    getReviews,
    register,
    uploadAvatar,
    getPublicPassengerById,
    login,
    logout
}