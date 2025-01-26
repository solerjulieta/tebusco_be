import * as yup from 'yup'

const vehicle = yup.object({
    licensePlate: yup.string().transform((value) => (value ? value.toLowerCase() : value)).test('custom-validation', 'La patente no es válida.', (value) => {
        if(value?.length === 6){
            return (/^[A-Za-z]{3}[0-9]{3}$/).test(value)
        } else if(value?.length === 7){
            return (/^[A-Za-z]{2}[0-9]{3}[A-Za-z]{2}$/).test(value)
        }
        return false //no cumple con la longitud
    }).required('La patente es requerida.'),
    brand: yup.string().required('La marca es requerida.'),
    model: yup.string().required('El modelo es requerido.'),
    wheelchair: yup.boolean()
})

export{
    vehicle
}