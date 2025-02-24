import * as yup from 'yup'

const contact = yup.object({
    name: yup.string().trim().required('El nombre es requerido.'),
    email: yup.string().email('El email ingresado no es válido.').required('El email es requerido'),
    comment: yup.string().trim().required('La consulta es requerida'),
})

export {
    contact
}