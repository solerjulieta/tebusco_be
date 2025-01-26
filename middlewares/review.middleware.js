import * as reviewSchemas from '../schemas/review.schemas.js'

async function validateReview(req, res, next)
{
    return reviewSchemas.createReview.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

async function validateReviewUpdated(req, res, next)
{
    return reviewSchemas.updateReview.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

export{
    validateReview,
    validateReviewUpdated
}