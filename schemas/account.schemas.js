import * as yup from 'yup'

const login = yup.object({
    email: yup.string().email('El email ingresado no es válido.').required('El email es requerido.'),
    password: yup.string().required('La contraseña es requerida.')
})

const emailSchema = yup.object({
    email: yup.string().email('El email ingresado no es válido.').required('El email es requerido.'),
})

const passwordSchema = yup.object({
    currentPassword: yup.string().required('La contraseña actual es requerida.'),
    newPassword: yup.string().matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/gm, 'La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial.').required('La nueva contraseña es requerida.'),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Las contraseñas no coinciden.').required('Debe confirmar la nueva contraseña.')
})

const resetPasswordSchema = yup.object({
    newPassword: yup.string().matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/gm, 'La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial.').required('La nueva contraseña es requerida.'),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Las contraseñas no coinciden.').required('Debe confirmar la nueva contraseña.')
})

export{
    login,
    emailSchema,
    passwordSchema,
    resetPasswordSchema
}