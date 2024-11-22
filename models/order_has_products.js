const db  = require('../config/config')
const OrderHasProducts = {};

OrderHasProducts.create = async (orderHasProducts, result)=>{
    const sql = `INSERT INTO order_has_products(
        id_order,
        id_product,
        quantity,
        created_at,
        updated_at
    )
    VALUES(?,?,?,?,?)    
    `;
    //const newUserId = uuidv4(); 
    db.query(sql,[
        orderHasProducts.id_order,
        orderHasProducts.id_product,
        orderHasProducts.quantity,
        new Date(),
        new Date()
    ],(err,res)=>{
        if(err){
            console.log('Error:', err)
            result(err,null)
        }else{
            console.log('Id de la OrderHasProducts:',res.insertId)
            result(null,res.insertId)
        }
    })
}


module.exports = OrderHasProducts;