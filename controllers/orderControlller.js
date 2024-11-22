const Order = require('../models/order')
const OrderHasProducts = require('../models/order_has_products')


module.exports = {

    async create(req,res){
        const order = req.body
        Order.create(order,async (err, id)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de la orden',
                    error: err
                })
            }
            
            for(const product of order.products){
                const orderHasProducts = {
                    id_order:id,
                    id_product:product.id,
                    quantity: product.quantity
                }
                await OrderHasProducts.create(orderHasProducts,(err, id_data)=>{
                    if(err){
                        return res.status(501).json({
                            success: false,
                            message: 'Hubo un error con el registro del order_has_orden',
                            error: err
                        })
                    }
                })
            }
            return res.status(201).json({
                success: true,
                message: 'Orden se creo con exito',
                data: id
            })
        })
    },

    async getList(req, res){
        const filters = req.query
        console.log("filters",filters)

        Order.getList(filters,(err, data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al listar las ordenes',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'Ordenes listadas con exito',
                data: data
            })
        })
    }
}