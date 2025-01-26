import { isValidPhoneNumber, parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js'
import * as yup from 'yup'

const register = yup.object({
    name: yup.string().trim().required('El nombre es requerido.'),
    lastname: yup.string().trim().required('El apellido es requerido.'),
    city: yup.string().required('La ciudad es requerida'),
    province: yup.string().required('La provincia es requerida'),
    street: yup.object().shape({
        address: yup.string().required('La dirección es obligatoria'),
        coordinates: yup.object().shape({
          lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
          lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
        })
    }).required('El domicilio de recogida es obligatorio'),
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
    cud: yup.string().trim(),
    affiliation: yup.string(),
    email: yup.string().trim().email('El email ingresado no es válido.').required('El email es requerido.'),
    password: yup.string().trim().required('La contraseña es requerida.').matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/gm, 'La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial.'),
    created_at: yup.date().default(() => new Date()),
})

const profileInformation = yup.object({
    about: yup.string().trim(),
    occupation: yup.string().trim(),
    cud: yup.string().trim()
})

const personalInformation = yup.object({
    name: yup.string().trim().required('El nombre es requerido.'),
    lastname: yup.string().trim().required('El apellido es requerido.'),
    street: yup.object().shape({
        address: yup.string().required('La dirección es obligatoria'),
        coordinates: yup.object().shape({
          lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
          lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
        })
    }).required('El domicilio de recogida es obligatorio'),
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
    cud: yup.string(),
    affiliation: yup.string(),
})

/*10/11
const addressSchema = yup.object({
    pickUp: yup.string().trim().required('El domicilio de retiro es requerido.'),
    destination: yup.string().trim().required('El domicilio del Centro de Rehabilitación es requerido.')
})*/

const addressSchema = yup.object({
  pickUp: yup.object().shape({
    address: yup.string().required('La dirección es obligatoria'),
    coordinates: yup.object().shape({
      lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
      lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
    }).required('Las coordenadas son obligatorias'),
  }).required('El domicilio de recogida es obligatorio'),
  destination: yup.object().shape({
    address: yup.string().required('La dirección es obligatoria'),
    coordinates: yup.object().shape({
      lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
      lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
    }).required('Las coordenadas son obligatorias'),
  }).required('El domicilio del Centro de Rehabilitación es requerido.'),
})

const daySchema = yup.object().shape({
  isSelected: yup.boolean().required(),
  entryTime: yup
    .string()
    .nullable()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido')
    .when('isSelected', {
      is: true,
      then: () => yup.string().required('Es requerido.'),
      otherwise: () => yup.string().nullable(),
    }),
  exitTime: yup
    .string()
    .nullable()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido')
    .when(['entryTime', 'isSelected'], {
      is: (entryTime, isSelected) => isSelected && entryTime,
      then: () => yup.string().required('Es requerido.')
        .test('compare-times', 'Egreso inválido.', function (exitTime) {
          const entryTime = this.parent.entryTime;
          const [entryHours, entryMinutes] = entryTime.split(':').map(Number);
          const [exitHours, exitMinutes] = exitTime.split(':').map(Number);
          
          const entryTotalMinutes = entryHours * 60 + entryMinutes;
          const exitTotalMinutes = exitHours * 60 + exitMinutes;

          return exitTotalMinutes > entryTotalMinutes;
        }),
      otherwise: () => yup.string().nullable(),
    }),
});

const hoursAndDaysSchema = yup.object().shape({
  days: yup.object().shape({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema
  })
});

/*10/11
const tripSchema = yup.object().shape({
  pickUp: yup.string().trim().required('El domicilio de retiro es requerido.'),
  destination: yup.string().trim().required('El domicilio del Centro de Rehabilitación es requerido.'),
  days: yup.object().shape({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema
  }),
})*/

const tripSchema = yup.object().shape({
  pickUp: yup.object().shape({
    address: yup.string().required('La dirección es obligatoria'),
    coordinates: yup.object().shape({
      lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
      lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
    }).required('Las coordenadas son obligatorias'),
  }).required('El domicilio de recogida es obligatorio'),
  destination: yup.object().shape({
    address: yup.string().required('La dirección es obligatoria'),
    coordinates: yup.object().shape({
      lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
      lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
    }).required('Las coordenadas son obligatorias'),
  }).required('El domicilio del Centro de Rehabilitación es requerido.'),
  days: yup.object().shape({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema
  }),
})

const extraInfoTripSchema = yup.object({
  hasTransfer: yup.boolean(),
  wheelchair: yup.boolean()
})


export{
    register,
    profileInformation,
    personalInformation,
    addressSchema,
    hoursAndDaysSchema,
    tripSchema,
    extraInfoTripSchema
}