import { Router } from 'express'
import * as passengerApiController from '../controllers/passengers.api.controller.js'
import * as reviewApiController from '../controllers/reviews.api.controller.js'
import * as userApiController from '../controllers/users.api.controller.js'
import * as tripApiController from '../controllers/trips.api.controller.js'
import { validateRegister, validateProfileInformation, validateAddress, validateHoursAndDays, extraInfoTripSchema } from '../../middlewares/passenger.middleware.js'
import { validateLogin, validateEmail, validatePassword, validateResetPassword } from '../../middlewares/account.validate.middleware.js'
import { assignRole } from '../../middlewares/assignRole.middleware.js'
import { isLogin } from '../../middlewares/auth.middleware.js'
import { validateReview, validateReviewUpdated } from '../../middlewares/review.middleware.js'
import { setUploadType, upload } from '../../middlewares/multer.js'
import resizeAndSave from '../../middlewares/resizeImage.middleware.js'
import { validateFileUpload } from '../../middlewares/validateFileUpload.middleware.js'

const router = Router()

router.route('/api/passenger')
      .post([validateRegister], passengerApiController.register)

router.route('/api/passenger/:id/trip')
      .get([isLogin], tripApiController.getByPassengerId)
      .post([validateAddress, validateHoursAndDays], tripApiController.createTrip)
      .patch([isLogin, validateAddress, validateHoursAndDays], tripApiController.updateTrip)

router.route('/api/passenger/:id/extraInfoTrip')
      .patch([isLogin, extraInfoTripSchema], tripApiController.updateExtraInfoTrip)

router.route('/api/passenger/profile')
      .get([isLogin], passengerApiController.getProfile)

router.route('/api/passenger/profile/:id/avatar')
      .post([isLogin, setUploadType('passengerProfile'), upload('avatar'), validateFileUpload, resizeAndSave], passengerApiController.uploadAvatar)

router.route('/api/passenger/profile/:id/edit')
      .post([isLogin, validateProfileInformation], passengerApiController.editProfile)

router.route('/api/passenger/profile/:id/email')
      .patch([isLogin, validateEmail], userApiController.updateEmail)

router.route('/api/passenger/profile/:id/password')
      .patch([isLogin, validatePassword], userApiController.updatePassword)

router.route('/api/passenger/forgot-password')
      .post([validateEmail, assignRole], userApiController.reqPasswordReset)

router.route('/api/passenger/forgot-password/:token')
      .post([validateResetPassword], userApiController.resetPassword)

router.route('/api/passenger/login')
      .post([validateLogin, assignRole], passengerApiController.login)

router.route('/api/passenger/logout')
      .delete([isLogin], passengerApiController.logout)

//Obtener transportistas
router.route('/api/passenger/drivers')
      .get([isLogin], passengerApiController.getDrivers)

router.route('/api/passenger/drivers/:id')
      .get([isLogin], passengerApiController.getPublicDriverById)

router.route('/api/passenger/drivers/:id/review')
      .post([isLogin, validateReview], reviewApiController.create)

router.route('/api/passenger/drivers/:driverId/review/:reviewId')
      .patch([isLogin, validateReviewUpdated], reviewApiController.update)
      .delete([isLogin], reviewApiController.deleteReview)

export default router