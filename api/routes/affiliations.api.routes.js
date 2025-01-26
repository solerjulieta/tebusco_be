import { Router } from 'express'
import * as affiliationsApiController from '../controllers/affiliations.api.controller.js'

const router = Router()

router.route('/api/affiliations')
      .get(affiliationsApiController.getAll)

export default router