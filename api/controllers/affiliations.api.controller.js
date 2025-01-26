import * as affiliationService from '../../services/affiliations.service.js'

async function getAll(req, res)
{
    affiliationService.getAll()
        .then(function(affiliations){
            res.status(200).json(affiliations)
        })
}

export{
    getAll
}