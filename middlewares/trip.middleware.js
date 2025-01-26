import * as tripSchemas from '../schemas/trip.schemas.js'

async function validateAddress(req, res, next)
{
    return tripSchemas.addressSchema.validate(req.body, { abortEarly: false })
        .then((data) => {
            req.body = data;
            console.log(data)
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

async function validateHoursAndDays(req, res, next)
{
    const { days } = req.body;

    // Verifica si al menos un día está seleccionado
    const hasSelectedDay = Object.values(days).some(day => day.isSelected);

    if (!hasSelectedDay) {
        return res.status(400).json({ error: { msg: 'Debes seleccionar al menos un día.'} });
    }

    // Filtra solo los días seleccionados
    const filteredDays = Object.fromEntries(
        Object.entries(days).filter(([_, day]) => day.isSelected)
    );
    
    // Asigna el objeto filtrado de días a la solicitud
    req.body.daysAndHours = filteredDays;

    return tripSchemas.hoursAndDaysSchema.validate(req.body, { abortEarly: false })
    .then((data) => {
        req.body = { ...req.body, ...data }
        next()
    })
    .catch((error) => {
        if (error.inner) {
            const errorMsgs = error.inner.map(err => ({
                path: err.path,
                msg: err.message
            }));
            res.status(400).json({ errors: errorMsgs });
        } else {
            res.status(400).json({ errors: [{ path: 'general', msg: error.message }] });
        }
    })
}

export{
    validateAddress,
    validateHoursAndDays
}