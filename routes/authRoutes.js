const authController = require('../controllers/authController')
const passport =  require('passport')

module.exports = (app,upload) =>{
    app.post('/api/auth/refresh',authController.refresh_token);
}   
