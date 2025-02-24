import { Router } from 'express'
import * as contactApiController from '../controllers/contact.api.controller.js'

const router = Router()

router.route('/api/contact')
      .post(contactApiController.sendEmail)

export default router