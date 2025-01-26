import * as provinceService from '../../services/provinces.service.js'

async function getAll(req, res)
{
    provinceService.getAll()
        .then(function(cities){
            res.status(200).json(cities)
        })
}

export{
    getAll
}