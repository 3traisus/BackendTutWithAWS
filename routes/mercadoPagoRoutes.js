const mercadoPagoController = require('../controllers/mercadoPagoController')
const passport =  require('passport')

module.exports = (app,upload) =>{
    // Get -> Obetener datos
    // Post -> Obetener datos
    // Put -> Obetener datos
    // Patch -> Obetener datos
    // Delete -> Eliminar datos

    app.post(
        '/api/payments/create',
        passport.authenticate('jwt',{session:false, failWithError:true}),
        mercadoPagoController.createPayment
    );

}