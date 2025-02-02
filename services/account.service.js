import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import crypto from 'crypto' //módulo parte del API estándar de Node.js 
import nodemailer from 'nodemailer' //biblioteca para enviar mails
import * as passengerService from './passengers.service.js'
import * as driverService from './drivers.service.js'
import { fileURLToPath } from 'url' //para manejar __dirname
import dotenv from 'dotenv'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const db = client.db('DB_TB')
const users = db.collection('users')

//Configuración de __dirname en ESM
const __filename = fileURLToPath(import.meta.url) //obtener el nombre del archivo actual.
const __dirname = path.dirname(__filename) //obtener el directorio del archivo actual.

dotenv.config()

async function register(account)
{
    await client.connect()

    const existingAccount = await users.findOne({ email: account.email })

    if(existingAccount){
        console.log("Entra al if de existingAccount")
        if(!existingAccount.roles.includes(account.roles[0])){
            await users.updateOne(
                { email: account.email },
                { $addToSet: { roles: account.roles[0] } }
            )
            return { ...existingAccount, roles: [...existingAccount.roles, account.roles[0]] }
        } else {
            throw new Error('Ya existe un usuario registrado con este email.')
        }
    } else {
        const newUser = { ...account }
        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(account.password, salt)
        await users.insertOne(newUser)
        return newUser
    }
}

async function login(account, expectedRole)
{
    await client.connect()

    const existingAccount = await users.findOne({ email: account.email })

    if(!existingAccount){
        throw new Error('No existe un usuario registrado con este email.')
    }

    if(!existingAccount.roles.includes(expectedRole)){
        throw new Error(`El usuario no tiene el rol de ${expectedRole}.`)
    }

    const passwordMatch = await bcrypt.compare(account.password, existingAccount.password)

    if(!passwordMatch){
        throw new Error('La contraseña es incorrecta.')
    }

    return {...existingAccount, password: undefined}
}

async function updateEmail(id, updatedEmail)
{
    await client.connect()

    const newEmail = updatedEmail

    const existingAccount = await users.findOne({ email: newEmail })

    if(existingAccount){
        throw new Error('Ya existe un usuario registrado con este email.')
    }

    const user = await users.findOne({ _id: new ObjectId(id) })

    const { roles } = user

    if(roles.includes('pasajero')){
        await passengerService.updateEmail(id, newEmail)
    }
    if(roles.includes('transportista')){
        await driverService.updateEmail(id, newEmail)
    }
    
    return users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { email: newEmail } }
    )
}

async function updatePassword(id, oldPassword, newPassword)
{
    await client.connect()

    const existingUser = await users.findOne({ _id: new ObjectId(id) })

    if(!existingUser){
        throw new Error('No existe este usuario.')
    }

    const passwordMatch = await bcrypt.compare(oldPassword, existingUser.password)

    if(!passwordMatch){
        throw new Error('La contraseña es incorrecta.')
    }

    const salt = await bcrypt.genSalt(10)
    existingUser.password = await bcrypt.hash(newPassword, salt)
    await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { password: existingUser.password } }
    )

    return { ...existingUser, password: undefined }
}

async function reqPasswordReset(email, userType)
{
    await client.connect()

    const user = await users.findOne({ email: email })

    if(!user){
        throw new Error('No existe un usuario registrado con este email.')
    }

    //Genero un token seguro
    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 3600000 //1 hora desde ahora

    //Guardar el token y su fecha de expiración en la base de datos.
    await users.updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { resetPasswordToken: token, resetPasswordExpires: expires } }
    )

    const resetRoute = userType === 'pasajero' ? 'passenger/forgot-password' : 'driver/forgot-password'
    const resetLink = `https://tebusco.vercel.app/${resetRoute}/${token}`

    const templatePath = path.join(__dirname, '..', 'templates', 'emails', 'reset-password.html')
    const emailTemplate = fs.readFileSync(templatePath, 'utf-8')

    const emailHtml = emailTemplate.replace(/{{resetLink}}/g, resetLink)

    //Enviar el correo con el token sin mailtrap
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    /*
    //Enviar el correo con el token con mailtrap 
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6408d532331326",
          pass: "cff0c4b5cd786f"
        }
    })*/

    const mailOptions = {
        to: email,
        from: 'no-responder@tebusco.com',
        subject: 'Restablecer contraseña',
        html: emailHtml 
    }

    return transporter.sendMail(mailOptions)
}

async function resetPassword(token, newPassword)
{
    await client.connect()

    console.log("Token recibido", token)
    console.log("Fecha actual (ms):", Date.now());

    //Busco al usuario con el token y verifico validez
    const user = await users.findOne({
        resetPasswordToken: token,
        //gt -> operador de mongo que significa greater than (mayor que)
        resetPasswordExpires: { $gt: Date.now() } // Asegurar que el token no haya expirado
    })

    if(!user){
        throw new Error('El token es inválido o ha expirado.')
    }

    //Encripto nueva contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    //Actualizo la contraseña y elimino el token
    return users.updateOne(
        { _id: new ObjectId(user._id) },
        { 
            $set: { password: hashedPassword },
            $unset: { resetPasswordToken: "", resetPasswordExpires: "" } //Remuevo los campos de token
        }
    )
}

export{
    register,
    login,
    updateEmail,
    updatePassword,
    reqPasswordReset,
    resetPassword
}