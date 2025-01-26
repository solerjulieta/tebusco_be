import * as accountService from '../../services/account.service.js'
import * as tokenService from '../../services/token.service.js'
import * as passengerService from '../../services/passengers.service.js'
import * as driverService from '../../services/drivers.service.js'
import * as reviewService from '../../services/reviews.service.js'

//Comentado el 08/09 para guardar el email también en el perfil
/*async function register(req, res)
{
    const account = {
        email: req.body.email,
        password: req.body.password,
        roles: ['pasajero'],
    }

    const profileData = {
        name: req.body.name,
        lastname: req.body.lastname,
        city: req.body.city,
        province: req.body.province,
        street: req.body.street,
        streetNumber: req.body.streetNumber,
        phone: req.body.phone,
        cud: req.body.cud,
        affiliation: req.body.affiliation,
        created_at: req.body.created_at
    }

    accountService.register(account)
        .then((newAccount) => {
            return passengerService.createProfile(newAccount._id, profileData)
        })
        .then((newAcc) => {
            res.status(201).json({ msg: 'Se ha registrado correctamente.' })
        })
        .catch(function(err){
            res.status(400).json({ error: { msg: err.message } })
        })
}*/

async function register(req, res)
{
    const account = {
        email: req.body.email,
        password: req.body.password,
        roles: ['pasajero'],
    }

    const profileData = {
        name: req.body.name,
        lastname: req.body.lastname,
        city: req.body.city,
        province: req.body.province,
        street: req.body.street,
        phone: req.body.phone,
        cud: req.body.cud,
        affiliation: req.body.affiliation || 'Particular',
        created_at: req.body.created_at
    }

    accountService.register(account)
        .then((newAccount) => {
            return passengerService.createProfile(newAccount, profileData)
        })
        .then((newAcc) => {
            res.status(201).json({ msg: 'Se ha registrado correctamente.', newAcc: newAcc })
        })
        .catch(function(err){
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function getProfile(req, res)
{
    passengerService.getProfile(req.account._id)
        .then(function(profile){
            if(profile){
                res.status(200).json(profile)
            } else {
                res.status(404).json({ error: { msg: err.message } })
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

    passengerService.uploadAvatar(id, avatar)
        .then(() => {
            res.status(200).json({ msg: 'Foto de perfil actualizada.', filename: avatar})
        })
        .catch((err) => {
            res.status(500).json({ error: { msg: err.message } })
        })
}

async function editProfile(req, res)
{
    const id = req.params.id
    const data = req.body

    console.log("La data que viene", data)

    const validFields = ['name', 'lastname', 'street', 'phone', 'affiliation', 'about', 'occupation', 'cud']
    const updateData = {}

    validFields.forEach(field => {
        if(data[field] !== undefined){
            updateData[field] = data[field]
        }
    })

    console.log("La data actualizada", updateData)

    passengerService.editProfile(id, updateData)
        .then(() => {
            res.status(200).json({ msg: 'Perfil actualizado.' })
        })
        .catch((err) => {
            res.status(500).json({ error: { msg: err.message } })
        })
}

async function login(req, res)
{
    return accountService.login(req.body, req.expectedRole)
        .then(async (account) => {
            return { token: await tokenService.create(account), account }
        }) 
        .then((auth) => {
            res.status(200).json(auth)
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
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function getDrivers(req, res)
{
    const filter = req.query

    driverService.getAll(filter)
        .then(function (drivers){
            res.status(200).json(drivers)
        })   
}

async function getPublicDriverById(req, res)
{
    const id = req.params.id

    driverService.getPublicDriverById(id)
        .then(driver => {
            if(!driver){
                return res.status(404).json({ msg: 'Transportista no encontrado.' })
            }

            return reviewService.getAll(id)
            .then(reviews => {
                driver.reviews = reviews
                res.status(200).json(driver)
            })
            .catch(err => {
                res.status(400).json({ error: { msg: err.message } })
            })
        })
}

export{
    register,
    getProfile,
    uploadAvatar,
    editProfile,
    //updateEmail,
    //updatePassword,
    getDrivers,
    getPublicDriverById,
    login,
    logout,
}