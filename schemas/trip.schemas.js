import * as yup from 'yup'

const addressSchema = yup.object({
  pickUp: yup.object().shape({
    address: yup.string().required('La dirección es obligatoria'),
    coordinates: yup.object().shape({
      lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
      lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
    })
  }).required('El domicilio de recogida es obligatorio'),
  destination: yup.object().shape({
    address: yup.string().required('La dirección es obligatoria'),
    coordinates: yup.object().shape({
      lat: yup.number().required('La latitud es obligatoria').typeError('Debe ser un número'),
      lng: yup.number().required('La longitud es obligatoria').typeError('Debe ser un número'),
    })
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
  })
  
const hoursAndDaysSchema = yup.object().shape({
  days: yup.object().shape({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema
  })
})

export{
    addressSchema,
    hoursAndDaysSchema
}