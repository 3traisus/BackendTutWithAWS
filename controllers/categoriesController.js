const Category = require('../models/categories')
const storage = require('../utils/cloud_storage')

module.exports = {
    async create(req, res){
        const category = JSON.parse(req.body.category) ;
        Category.create(category,(err, data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de la Categorie',
                    error: err
                })
            }
            Category.findByid(data,(err,categoryData)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Fallo la busqueda de la cetegoria',
                        error: err
                    })
                }

                return res.status(201).json({
                    success: true,
                    message: 'Categoria registrada con exito',
                    data: categoryData // El Id del nuevo usuario
                })
                
            })
        })

    }
}
