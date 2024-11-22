const orderControlller = require('../controllers/orderControlller')
const passport =  require('passport')

module.exports = (app,upload) =>{
    // Get -> Obetener datos
    // Post -> Obetener datos
    // Put -> Obetener datos
    // Patch -> Obetener datos
    // Delete -> Eliminar datos

    app.post(
        '/api/order/create',
        passport.authenticate('jwt',{session:false, failWithError:true}),
        orderControlller.create
    );
    app.get(
        '/api/orders',
        passport.authenticate('jwt',{session:false, failWithError:true}),
        orderControlller.getList
    );
}