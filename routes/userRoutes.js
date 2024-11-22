const usersController = require('../controllers/usersController')
const passport =  require('passport')

module.exports = (app,upload) =>{
    // Get -> Obetener datos
    // Post -> Obetener datos
    // Put -> Obetener datos
    // Patch -> Obetener datos
    // Delete -> Eliminar datos

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/login', usersController.login);
    app.post('/api/user/authenticateToken',usersController.authenticateToken);

    //401 UNAUTHORIZED 
    app.patch(
        '/api/users/update/:id',
        passport.authenticate('jwt',{session:false, failWithError:true}),
        upload.array('image',1), 
        usersController.update)
       
    //app.patch('/api/users/update/:id',upload.array('image',1), usersController.update);

}   


/*
 (err, req, res, next) => {
            console.log("aqui")
            if (err && err.success === false) {
                console.log("aca")
                // Manejar el error de Passport con tu formato personalizado
                return res.status(401).json({
                    success: false,
                    message: err.message || 'Error de autenticación',
                    error: err.error || null
                });
            }
            next();
        });
*/