import * as reviewService from '../../services/reviews.service.js'

async function create(req, res)
{
    const driverId = req.params.id

    const newReview = {
        passenger_id: req.account._id, 
        ranking: req.body.ranking,
        comment: req.body.comment,
        created_at: req.body.created_at
    }

    reviewService.create(driverId, newReview)
        .then(function(review){
            res.status(201).json(review)
        })
}

async function update(req, res)
{
    const { driverId, reviewId } = req.params
    const passengerId = req.account._id

    const dataReview = {
        ranking: req.body.ranking,
        comment: req.body.comment
    }

    reviewService.update(driverId, reviewId, passengerId, dataReview)
        .then(() => {
            res.status(200).json({ msg: 'Tu reseña se ha modificado correctamente.' })
        })
        .catch(err => {
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function deleteReview(req, res)
{
    const { driverId, reviewId } = req.params
    const passengerId = req.account._id

    reviewService.deleteReview(driverId, reviewId, passengerId)
        .then(function(review){
            if(review){
                res.status(200).json(review)
            } else {
                res.status(404).json({ error: { msg: `No se encontró la reseña ${reviewId}.` } })
            }
        })
        .catch(err => {
            res.status(400).json({ error: { msg: err.message } })
        })
}

export{
    create,
    update,
    deleteReview
}