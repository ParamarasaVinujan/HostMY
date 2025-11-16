const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder,cancelOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authonticate');
const router = require('express').Router();

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myallorders').get(isAuthenticatedUser,myOrders);
router.route('/order/:id/cancel').put(isAuthenticatedUser, cancelOrder);

//admin routes
router.route('/admin/order/all').get(isAuthenticatedUser,authorizeRoles('admin'),orders);
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder);
router.route('/admin/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);
module.exports=router;

