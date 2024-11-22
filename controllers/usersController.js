const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const storage = require('../utils/cloud_storage')
const Rol = require('../models/rol')


module.exports = {

    async login(req, res){
        console.log('req',req.body)
        const email = req.body.email
        const password = req.body.password
        User.findByemail (email, async(err, user)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                })
            }

            if(!user)
                return res.status(401).json({//cliente sin autorizacion para realizar la peticion
                    success: false,
                    message: 'El email no fue encontrado',
                })


            const isPasswordValid = await  bcrypt.compare(password,user.password)
            if(isPasswordValid){
                const token = jwt.sign({
                    id:user.id,
                    email:user.email
                },keys.secretOrKey,{expiresIn:'15m'})
                const refresh_token = jwt.sign({
                    id:user.id,
                    email:user.email
                },keys.secretOrKey,{expiresIn:'7d'})
                const data = {
                    id : user.id,
                    name:user.name,
                    lastname:user.lastname,
                    email:user.email,
                    phone: user.phone,
                    image: user.image,
                    cedula: user.cedula,
                    session_token: `Bearer ${token}`,
                    refresh_token: `${refresh_token}`,
                    roles: user.roles
                }
                return res.status(201).json({//cliente sin autorizacion para realizar la peticion
                    success: true,
                    message: 'El usuario fue autenticado',
                    data:data
                })
            }else{
                return res.status(401).json({//cliente sin autorizacion para realizar la peticion
                    success: false,
                    message: 'El password no es valido',
                })
            }
        })
    },

    async register(req, res){
        const user = req.body; //capturamos los datos
        User.create(user,(err, data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                })
            }

            Rol.create(data,3,(err,user)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Fallo el registro del rol del usuario',
                        error: err
                    })
                }                
            })

            User.findByid(data,(err,user)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Fallo la busqueda del nuevo usuario',
                        error: err
                    })
                }

                return res.status(201).json({
                    success: true,
                    message: 'Registro Exitoso',
                    data: user // El Id del nuevo usuario
                })
                
            })
        })
    },

    async update(req, res){
        const id = req.params.id
        const updatefilds = JSON.parse(req.body.user);
        const files = req.files;

        if(files.length > 0 && files){
            const path = `image_${Date.now()}`
            const uri = await storage(files[0],path)
            if(uri != undefined && uri !=null){
                console.log("aqui")
                updatefilds.image = uri
            }
        }
        
        User.update(id,updatefilds,(err,data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizaciond de los datos',
                    error: err
                })
            }

            User.findByid(id,(err,user)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error obteniendo los datos actualizados',
                        error: err
                    })
                }

                return res.status(201).json({
                    success: true,
                    message: 'Actualizacion de datos exitosa',
                    data: user
                })
            })
        })
    },

    async authenticateToken(req, res){
        const authHeader= req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const {refresh_token} = req.body

        console.log("refresh_token",token)
        console.log("refresh_token",refresh_token)
        jwt.verify(refresh_token, keys.secretOrKey, (err, user) => {
            if (err) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Token invalido',
                    data: null
                });
            }

            return res.status(201).json({ 
                success: true,
                message: 'Token aun valido',
                data: user
             });
        });
    }
}