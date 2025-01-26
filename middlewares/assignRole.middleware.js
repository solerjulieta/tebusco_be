function assignRole(req, res, next)
{
    if(req.originalUrl.includes('/api/driver')){
        req.expectedRole = 'transportista'
    } else if(req.originalUrl.includes('/api/passenger')){
        req.expectedRole = 'pasajero'
    } else {
        return res.status(400).json({ msg: 'Ruta inválida.' })
    }
    next()
}

export{
    assignRole
}