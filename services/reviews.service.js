import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')
const db = client.db('DB_TB')
const driverReviews = db.collection('driverReviews')
const passengers = db.collection('passengersProfile')

async function getAll(id)
{
    await client.connect()
    const allReviews = await driverReviews.findOne({ _id: new ObjectId(id) })
    return allReviews ? allReviews.reviews : []
}

async function getById(driverId, reviewId)
{
    await client.connect()
    return driverReviews.findOne(
        { 
            _id: new ObjectId(driverId), 
            'reviews.review_id': new ObjectId(reviewId)
        },
        {
            projection: {
                reviews:{
                    $elemMatch: { review_id: new ObjectId(reviewId) }
                }
            }
        }
    )
}

async function getByDriverId(id)
{
    await client.connect()
    return driverReviews.findOne({ _id: new ObjectId(id) })
}

async function getReviewsByDriverIds(driverIds) {
    await client.connect();
    
    const reviewsList = await driverReviews.find({ _id: { $in: driverIds.map(id => new ObjectId(id)) } }).toArray();
    
    const reviewsById = {};
    reviewsList.forEach(review => {
        reviewsById[review._id.toString()] = review.reviews;
    });

    return reviewsById;
}

async function create(driverId, review)
{
    await client.connect()

    const passenger = await passengers.findOne({ _id: new ObjectId(review.passenger_id) })

    const newReview = {
        review_id: new ObjectId(),
        avatar: passenger.avatar,
        name: passenger.name,
        lastname: passenger.lastname,
        ...review
    }

    newReview.passenger_id = new ObjectId(review.passenger_id)

    const update = await driverReviews.updateOne(
        { _id: new ObjectId(driverId) },
        { $push: { reviews: newReview } }
    )

    if(update.matchedCount == 0){
        await driverReviews.insertOne({ _id: new ObjectId(driverId), reviews: [newReview] })
    }

    return review
}

async function update(driverId, reviewId, passengerId, dataReview)
{
    await client.connect()

    const reviewDocument = await driverReviews.findOne(
        {        
            _id: new ObjectId(driverId),
            'reviews': {
                $elemMatch: {
                    review_id: new ObjectId(reviewId),
                    passenger_id: new ObjectId(passengerId)
                }
            }
        },
        { projection: {'reviews.$': 1 } }
    )

    if(!reviewDocument){
        throw new Error('Reseña no encontrada o sin autorización para editar.')
    }

    const updateFields = {}
    if(dataReview.ranking !== undefined){
        updateFields['reviews.$.ranking'] = dataReview.ranking
    }
    if(dataReview.comment !== undefined){
        updateFields['reviews.$.comment'] = dataReview.comment
    }

    const updateReview = await driverReviews.updateOne({
        _id: new ObjectId(driverId),
        'reviews.review_id': new ObjectId(reviewId),
        'reviews.passenger_id': new ObjectId(passengerId)
    },
    {
        $set: updateFields
    })

    if(update.matchedCount === 0){
        throw new Error('Reseña no encontrada.')
    }

    return updateReview
}

async function deleteReview(driverId, reviewId, passengerId)
{
    await client.connect()

    const reviewDocument = await getById(driverId, reviewId)

    if(!reviewDocument){
        throw new Error('La reseña no existe.')
    }
    if(reviewDocument.reviews[0].passenger_id.toString() !== passengerId.toString()){
        throw new Error('No estas autorizado/a a eliminar esta reseña.')
    }

    await driverReviews.updateOne(
        {
            _id: new ObjectId(driverId)
        },
        {
            $pull: { reviews: { review_id: new ObjectId(reviewId), passenger_id: new ObjectId(passengerId) } }
        }
    )

    return {
        id: reviewId
    }
}

async function updatePassengerInfo(passengerId, updatedData)
{
    await client.connect()

    const updateFields = {}
    if(updatedData.avatar){
        updateFields["reviews.$[elem].avatar"] = updatedData.avatar
    }
    if(updatedData.name){
        updateFields["reviews.$[elem].name"] = updatedData.name
    }
    if(updatedData.lastname){
        updateFields["reviews.$[elem].lastname"] = updatedData.lastname
    }

    const updateResult = await driverReviews.updateMany(
        { "reviews.passenger_id": new ObjectId(passengerId) },
        { $set: updateFields },
        {
            arrayFilters: [{ "elem.passenger_id": new ObjectId(passengerId) }]
        }
    )

    return updateResult
}

export{
    getAll,
    getById,
    getByDriverId,
    getReviewsByDriverIds,
    create,
    update,
    deleteReview,
    updatePassengerInfo
}