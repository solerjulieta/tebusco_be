import { Router } from 'express';
import * as vehiclesApiController from '../controllers/vehicles.api.controller.js'

const router = Router()

router.route('/api/vehicles')
      .get(vehiclesApiController.getAll)

export default router