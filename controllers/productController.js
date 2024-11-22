const Producto = require('../models/products')
const storage = require('../utils/cloud_storage')
const asyncForEach = require('../utils/async_foreach')


module.exports = {
    async register(req, res){
        const producto = req.body; //capturamos los datos
        const files = req.files;
        let inserts = 0;

        if(files)
        if(files.length === 0 && files){
            return res.status(400).json({
                success: false,
                message: 'Error al registrar el producto no tiene imagenes',
            })
        }else{
            const start = async()=>{
                await asyncForEach(files,async(file)=>{
                    if(file.length > 0 && file){
                        const path = `image_${Date.now()}`
                        const uri = await storage(file[0],path)
                        if(uri != undefined && uri !=null){
                            producto.image[++inserts] = uri //improvisaste
                        }
                    }
                })
            }
            start()
        }
        Producto.create(producto,(err, data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del producto',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Producto registrado con exito',
                error: data
            })
        })        
    },

    async getList(req, res){
        const filters = req.query
        Producto.getList(filters,(err, data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del producto',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Productos obtenidos',
                data: data
            })
        })        
    },
}