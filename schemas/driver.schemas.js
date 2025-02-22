import { isValidPhoneNumber, parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js'
import * as yup from 'yup'

const register = yup.object({
    //avatar: yup.mixed(),
    name: yup.string().required('El nombre es requerido.'),
    lastname: yup.string().required('El apellido es requerido.'),
    dni: yup.number().typeError('El dni debe ser válido.').min(7, 'El DNI debe tener al menos 7 caracteres.').required('El DNI es requerido.'),
    phone: yup.string()
        .test('is-valid-phone', 'Número de teléfono inválido', (value) => {
            if (!value) return false;

            //Agrego el prefijo "+" si no está presente
            const formattedValue = value.startsWith('+') ? value : `+${value}`

            // Intentar analizar el número de teléfono
            const phoneNumber = parsePhoneNumberFromString(formattedValue);

            if (!phoneNumber || !phoneNumber.isValid()) {
                return false; // Número inválido
            }

            // Si el número es de Argentina, agregar el 9 después del +54
            if (phoneNumber.country === 'AR') {
                // Comprobar si el número es móvil en Argentina (debería tener 10 dígitos)
                if (value.startsWith('+54') && value.length === 13) {
                    // Si es un número válido en Argentina, agregar un "9" después del código de país
                    const formattedValue = value.slice(0, 3) + '9' + value.slice(3);
                    // Verificar si el número con el "9" agregado es válido
                    const formattedPhoneNumber = parsePhoneNumberFromString(formattedValue);
                    return formattedPhoneNumber && formattedPhoneNumber.isValid();
                }
            }

            // Si no es Argentina o ya tiene el formato correcto, validarlo tal cual
            return phoneNumber.isValid();
        })
        .required('El teléfono es requerido.'),
    city: yup.string().required('La ciudad es requerida.'),
    province: yup.string().required('La provincia es requerida.'),
    affiliations: yup.array().of(yup.string()),
    authorization: yup.mixed().required('La habilitación es requerida.'),
    email: yup.string().email('El email ingresado no es válido.').required('El email es requerido.'),
    password: yup.string().required('La contraseña es requerida.').matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/gm, 'La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial.'),
    created_at: yup.date().default(() => new Date()),
})

const profileInformation = yup.object({
    about: yup.string().trim(),
    affiliations: yup.array().of(yup.string()),
    workingSince: yup.date()
})

const personalInformation = yup.object({
    name: yup.string().trim().required('El nombre es requerido.'),
    lastname: yup.string().trim().required('El apellido es requerido.'),
    phone: yup.string()
        .test('is-valid-phone', 'Número de teléfono inválido', (value) => {
            if (!value) return false;

            //Agrego el prefijo "+" si no está presente
            const formattedValue = value.startsWith('+') ? value : `+${value}`

            // Intentar analizar el número de teléfono
            const phoneNumber = parsePhoneNumberFromString(formattedValue);

            if (!phoneNumber || !phoneNumber.isValid()) {
                return false; // Número inválido
            }

            // Si el número es de Argentina, agregar el 9 después del +54
            if (phoneNumber.country === 'AR') {
                // Comprobar si el número es móvil en Argentina (debería tener 10 dígitos)
                if (value.startsWith('+54') && value.length === 13) {
                    // Si es un número válido en Argentina, agregar un "9" después del código de país
                    const formattedValue = value.slice(0, 3) + '9' + value.slice(3);
                    // Verificar si el número con el "9" agregado es válido
                    const formattedPhoneNumber = parsePhoneNumberFromString(formattedValue);
                    return formattedPhoneNumber && formattedPhoneNumber.isValid();
                }
            }

            // Si no es Argentina o ya tiene el formato correcto, validarlo tal cual
            return phoneNumber.isValid();
        })
        .required('El teléfono es requerido.'),
})

const availability = yup.object().shape({
    isSelected: yup.boolean().required(),
    from: yup.string().when('isSelected', {
        is: true,
        then: () => yup.string().required('Es requerido.'),
        otherwise: () => yup.string().nullable(),
    }),
    to: yup.string().when('isSelected', {
        is: true,
        then: () => yup.string().required('Es requerido.').test('is-after-from', 'Horario inválido.', function (value) {
            const { from } = this.parent 
            return value > from
        }),
        otherwise: () => yup.string().nullable(),
    })
}).required("Debes ingresar al menos un horario")

const daysSchemas = yup.object().shape({
    days: yup.object().shape({
        monday: availability,
        tuesday: availability,
        wednesday: availability,
        thursday: availability,
        friday: availability,
        saturday: availability
    })
})

export{
    register,
    profileInformation,
    personalInformation,
    //availability
    daysSchemas
}