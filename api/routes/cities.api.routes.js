import { Router } from 'express'
import * as citiesApiController from '../controllers/cities.api.controller.js'

const router = Router()

router.route('/api/cities')
      .get(citiesApiController.getAll)

export default router