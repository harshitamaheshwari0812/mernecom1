const express=require('express')
const router=express.Router()
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder} = require('../controller/orderController')
const { isAuthUser,authorizedRoles } = require('../middleware/auth')

router.route('/order/new').post(isAuthUser,newOrder)
router.route('/order/:id').get(isAuthUser,getSingleOrder)
router.route('/orders/me').get(isAuthUser,myOrders)
router.route('/admin/orders').get(isAuthUser,authorizedRoles('admin'),getAllOrders)
router.route('/admin/order/:id')
.put(isAuthUser,authorizedRoles('admin'),updateOrderStatus)
.delete(isAuthUser,authorizedRoles('admin'),deleteOrder)

module.exports=router