import * as cityService from '../../services/cities.service.js'

async function getAll(req, res)
{
    cityService.getAll()
        .then(function(cities){
            res.status(200).json(cities)
        })
}

export{
    getAll
}