const Auth = require('../models/auth')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

module.exports = {
    async refresh_token(req, res) {
        const { token } = req.body;
        console.log("req.body", req.body);
        console.log("token", token);
        
        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token es requerido',
                error: null
            });
        }
    
        jwt.verify(token, keys.secretOrKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Refresh token inválido o expirado',
                    error: err
                });
            }

            console.log("decoded", decoded);
            Auth.generateAccessToken(decoded.id, decoded.email,(err,result)=>{
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: 'Token no pudo ser generado',
                        error: err
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Nuevo token de acceso generado',
                    data: { session_token: `Bearer ${result}` }
                });
            });
        })
    }
}


/*async refresh_token(req, res) {
    const { token } = req.body;
    console.log("req.body", req.body);
    console.log("token", token);
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token es requerido',
            error: null
        });
    }

    try {
        // Verificar si el refresh token es válido
        jwt.verify(token, keys.secretOrKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Refresh token inválido o expirado',
                    error: err
                });
            }

            console.log("decoded", decoded);
            Auth.generateAccessToken(decoded.id, decoded.email,(err,result)=>{
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: 'Token no pudo ser generado',
                        error: err
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Nuevo token de acceso generado',
                    data: { session_token: `Bearer ${result}` }
                });
            });
            //const accessToken = jwt.sign({ id:decoded.id, email:decoded.email }, keys.secretOrKey, { expiresIn: '2m' });

            /*return res.status(200).json({
                success: true,
                message: 'Nuevo token de acceso generado',
                data: { session_token: `Bearer ${accessToken}` }
            });
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error del servidor al generar el nuevo token',
            error: err
        });
    }
}*/







































    /*async refresh_token(req, res) {
        const { token } = req.body;
        console.log("req.body", req.body);
        console.log("token", token);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token es requerido',
                error: null
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error del servidor al generar el nuevo token',
            error: null
        });
        
        try {
            // Verificar si el refresh token es válido
            jwt.verify(token, keys.secretOrKey, (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        message: 'Refresh token invalido o expirado',
                        error: err
                    });
                }

                console.log("decoded", decoded);
                const accessToken = Auth.generateAccessToken(decoded.id, decoded.email);

                return res.status(200).json({
                    success: true,
                    message: 'Nuevo token de acceso generado',
                    data: {accessToken:`Bearer ${accessToken}`} // Usar 'access_token' para mantener consistencia con el frontend
                });
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error del servidor al generar el nuevo token',
                error: err
            });
        }*/






    /*
    async resfresh_token(req, res){
        const {token} = req.body
        console.log("req.body",req.body)
        console.log("token",token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token es requerido',
                error:null
            });
        }
        
        try {
        // Verificar si el refresh token es válido
        jwt.verify(token, keys.secretOrKey,(err,decoded)=>{
            if(err){
                return res.status(403).json({
                    success: false,
                    message: 'Refresh token invalido',
                    error:err
                })
            }

            console.log("decoded",decoded)
            const accessToken = Auth.generateAccessToken(decoded.id,decoded.email);

            return res.status(201).json({
                success: true,
                message: 'Acceso nuevo obtenido',
                data:accessToken
            }) 
        });  
        } catch (err) {
            return res.status(401).json({//cliente sin autorizacion para realizar la peticion
                success: false,
                message: 'Refresh token no valido o expirado',
                error: null
            })
        }
    }*/

