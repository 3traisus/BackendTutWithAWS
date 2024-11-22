const stripesController = require('../controllers/stripesController')
const passport =  require('passport')


module.exports = (app,upload) =>{
    // Get -> Obetener datos
    // Post -> Obetener datos
    // Put -> Obetener datos
    // Patch -> Obetener datos
    // Delete -> Eliminar datos

    app.post(
        '/api/stripes/payment_sheet',
        passport.authenticate('jwt',{session:false, failWithError:true}),
        stripesController.payment_sheet
    );

}