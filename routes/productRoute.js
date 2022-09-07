const express=require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct,getProductDetails, createProductReview, getProductReviews, deleteReview } = require('../controller/productController')
const { isAuthUser,authorizedRoles } = require('../middleware/auth')
const router=express.Router()
// http://localhost:4000
// router.route('/').get(getAllProducts)
// router.route('/add').post(isAuthUser,authorizedRoles('admin'),createProduct)
// router.route('/:id').put(isAuthUser,updateProduct)
//                     .delete(isAuthUser,deleteProduct)
//                     .get(getProductDetails)

   router.route("/products").get(getAllProducts);
    router
    .route("/admin/product/new")
    .post(isAuthUser, authorizedRoles("admin"), createProduct);
                    
    router
    .route("/admin/product/:id")
    .put(isAuthUser, authorizedRoles("admin"), updateProduct)
    .delete(isAuthUser, authorizedRoles("admin"), deleteProduct);
                    
    router.route("/product/:id").get(getProductDetails);

    router.route('/review').put(isAuthUser,createProductReview)

    router.route("/reviews").get(getProductReviews).delete(isAuthUser,deleteReview)
module.exports=router