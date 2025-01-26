import * as passengerSchemas from '../schemas/passenger.schemas.js'

async function validateRegister(req, res, next)
{
    return passengerSchemas.register.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data;
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

async function validateProfileInformation(req, res, next)
{
    if(req.body.formType === 'profileInformation'){
        return passengerSchemas.profileInformation.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data;
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
    } else {
        return passengerSchemas.personalInformation.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data;
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        }) 
    }
}

async function validateAddress(req, res, next)
{
    return passengerSchemas.addressSchema.validate(req.body, { abortEarly: false })
        .then((data) => {
            req.body = data;
            console.log(data)
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

/*
async function validateHoursAndDays(req, res, next) {
    console.log("Datos recibidos:", req.body); // Verifica qué datos llegan aquí
    return passengerSchemas.hoursAndDaysSchema.validate(req.body, { abortEarly: false })
        .then((data) => {
            req.body = { ...req.body, ...data };
            console.log("La data es:", data);
            next();
        })
        .catch((error) => {
            const errorMsgs = error.inner.map(err => ({
                path: err.path,
                msg: err.message // Asegúrate de usar err.message aquí
            }));
            console.log(errorMsgs);
            res.status(400).json({ errors: errorMsgs });
        });
}*/

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

    return passengerSchemas.hoursAndDaysSchema.validate(req.body, { abortEarly: false })
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

async function extraInfoTripSchema(req, res, next)
{
    console.log("La data es", req.body)
    return passengerSchemas.extraInfoTripSchema.validate(req.body, { abortEarly: false })
        .then((data) => {
            req.body = data;
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

/*async function validateHoursAndDays(req, res, next) {
    console.log("Datos recibidos:", req.body); // Verifica los datos
    try {
        const data = await passengerSchemas.hoursAndDaysSchema.validate(req.body, { abortEarly: false });
        req.body = { ...req.body, ...data };
        console.log("La data es:", data);
        next();
    } catch (error) {
        if (error.inner) {
            const errorMsgs = error.inner.map(err => ({
                path: err.path,
                msg: err.message
            }));
            console.log(errorMsgs);
            res.status(400).json({ errors: errorMsgs });
        } else {
            console.error('Error de validación general:', error);
            res.status(400).json({ errors: [{ path: 'general', msg: error.message }] });
        }
    }
}*/

/*
async function validateHoursAndDays(req, res, next) {
    console.log("Datos recibidos:", req.body); // Verifica qué datos llegan aquí
    try {
        const validatedData = await passengerSchemas.hoursAndDaysSchema.validate(req.body, { abortEarly: false });
        req.body = { ...req.body, ...validatedData }; // Conservar los campos validados y no sobrescribir todo
        console.log("La data es:", validatedData);
        next();
    } catch (error) {
        const errorMsgs = error.inner.map(err => ({
            path: err.path,
            msg: err.message
        }));
        console.log(errorMsgs);
        return res.status(400).json({ errors: errorMsgs });
    }
}*/

export{
    validateRegister,
    validateProfileInformation,
    validateAddress,
    validateHoursAndDays,
    extraInfoTripSchema
}