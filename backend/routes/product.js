const { getAllProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, getAdminProducts, getCategoryProducts } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authonticate');
const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const upload = multer({storage:multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.join(__dirname,'..','uploads/product'))
  },
  filename:function(req,file,cb){
    cb(null,file.originalname)
  }
})})

router.route('/product/all').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/product/category/:category').get(getCategoryProducts);

//admin routes
router.route('/admin/product/all').get(isAuthenticatedUser,authorizeRoles('admin'),getAdminProducts);
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),newProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),updateProduct);
router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

module.exports =router;