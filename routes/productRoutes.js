const productController = require('../controllers/productController')
const passport =  require('passport')

module.exports = (app,upload) =>{

        app.get(
            '/api/products',
            passport.authenticate('jwt',{session:false, failWithError:true}),
            productController.getList
        )

        //401 UNAUTHORIZED 
        app.post(
            '/api/products/create',
            passport.authenticate('jwt',{session:false, failWithError:true}),
            upload.array('image',3), 
            productController.register
        )
}   
