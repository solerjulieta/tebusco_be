import { Router } from 'express'
import * as driverApiController from '../controllers/drivers.api.controller.js'
import * as tripsApiController from '../controllers/trips.api.controller.js'
import * as userApiController from '../controllers/users.api.controller.js'
import * as driverVehiclesApiController from '../controllers/driversVehicles.api.controller.js'
import * as availabilityController from '../controllers/availability.api.controller.js'
import { validateEmail, validateLogin, validatePassword, validateResetPassword } from '../../middlewares/account.validate.middleware.js'
import { validateRegister, validateProfileInformation } from '../../middlewares/driver.middleware.js'
import { upload, setUploadType } from '../../middlewares/multer.js'
import { assignRole } from '../../middlewares/assignRole.middleware.js'
import { isLogin } from '../../middlewares/auth.middleware.js'
import { validateVehicle } from '../../middlewares/vehicle.middleware.js'
import { validateAddress, validateHoursAndDays } from '../../middlewares/trip.middleware.js'
import resizeAndSave from '../../middlewares/resizeImage.middleware.js'
import { validateFileUpload } from '../../middlewares/validateFileUpload.middleware.js'

const router = Router()

router.route('/api/driver')
      .get([isLogin], driverApiController.getAll)
      .post([setUploadType('driverAuth'), upload('authorization'), resizeAndSave, validateRegister], driverApiController.register)

router.route('/api/driver/profile')
      .get([isLogin], driverApiController.getProfile)

router.route('/api/driver/profile/:id/avatar')
      .post([isLogin, setUploadType('driverProfile'), upload('avatar'), validateFileUpload, resizeAndSave], driverApiController.uploadAvatar)

router.route('/api/driver/:id/reviews')
      .get([isLogin], driverApiController.getReviews)

router.route('/api/driver/profile/:id/edit')
      .post([isLogin, validateProfileInformation], driverApiController.editProfile)

router.route('/api/driver/profile/:id/email')
      .patch([isLogin, validateEmail], userApiController.updateEmail)

router.route('/api/driver/profile/:id/password')
      .patch([isLogin, validatePassword], userApiController.updatePassword)

router.route('/api/driver/forgot-password')
      .post([validateEmail, assignRole], userApiController.reqPasswordReset)

router.route('/api/driver/forgot-password/:token')
      .post([validateResetPassword], userApiController.resetPassword)

router.route('/api/driver/:id/vehicle')
      .post([isLogin, validateVehicle], driverVehiclesApiController.updateVehicle)
      .patch([isLogin], driverVehiclesApiController.updateAccessData)
      .delete([isLogin], driverVehiclesApiController.deleteVehicle)

router.route('/api/driver/:id/availability')
      .get([isLogin], availabilityController.getByDriverId)
      .post([isLogin], availabilityController.create)


/**
 * Trips
 */
router.route('/api/driver/requests')
      .get([isLogin], tripsApiController.getAll)

router.route('/api/driver/:id/filteredRequests')
      .get([isLogin], tripsApiController.getFilteredTrips)

router.route('/api/driver/:id/trips')
      .get([isLogin], tripsApiController.getByDriverId)
      .post([isLogin, validateAddress, validateHoursAndDays], tripsApiController.createTrip)

router.route('/api/driver/:id/:tripId/trips')
      .post([isLogin], tripsApiController.addDriver)

router.route('/api/driver/:pickUp/:destination/trips')
      .get([isLogin], tripsApiController.getByAddress)

/**
 * Obtener pasajeros
 */
router.route('/api/driver/passengers/:id')
      .get([isLogin], driverApiController.getPublicPassengerById)

router.route('/api/driver/login')
      .post([validateLogin, assignRole], driverApiController.login)

router.route('/api/driver/logout')
      .delete([isLogin], driverApiController.logout)

export default router