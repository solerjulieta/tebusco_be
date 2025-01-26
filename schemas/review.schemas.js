import * as yup from 'yup'

const createReview = yup.object({
    ranking: yup.number().required('La puntuación es requerida.'),
    comment: yup.string().required('La reseña es requerida.'),
    created_at: yup.date().default(() => new Date()),
})

const updateReview = yup.object({
    ranking: yup.number(),
    comment: yup.string()
})

export{
    createReview,
    updateReview
}