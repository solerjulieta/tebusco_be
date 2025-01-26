import * as tokenService from '../services/token.service.js'

async function isLogin(req, res, next)
{
    const token = req.headers['auth-token']

    if(!token){
        return res.status(401).json({ error: { msg: 'No se envió el token.' } })
    }

    const account = await tokenService.verify(token)

    if(!account){
        return res.status(401).json({ error: { msg: 'El token es inválido.' } })
    }

    req.account = account

    next()
}

export{
    isLogin
}