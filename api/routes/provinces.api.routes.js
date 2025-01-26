import { Router } from 'express'
import * as provincesApiController from '../controllers/provinces.api.controller.js'

const router = Router()

router.route('/api/provinces')
      .get(provincesApiController.getAll)

export default router