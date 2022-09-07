const express=require('express')
const router=express.Router()
const {registerUser,loginUser, logoutUser,getUserDetails,updatePassword,updateProfile,getAllUser,getSingleUser,updateUserRole,deleteUser,forgotPassword,resetPassword}=require('../controller/userController')
    const { isAuthUser,authorizedRoles } = require('../middleware/auth')
// http://localhost:4000
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(isAuthUser,forgotPassword)
router.route("/password/reset/:token").put(isAuthUser,resetPassword)
router.route('/logout').post(logoutUser)

router.route("/me").get(isAuthUser, getUserDetails);

router.route("/password/update").put(isAuthUser, updatePassword);

router.route("/me/update").put(isAuthUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthUser, authorizedRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthUser, authorizedRoles("admin"), updateUserRole)
  .delete(isAuthUser, authorizedRoles("admin"), deleteUser);

module.exports=router