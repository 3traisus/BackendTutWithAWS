const db  = require('../config/config')
const Order = {};

Order.create = async (order, result)=>{
    const sql = `INSERT INTO orders(
        id_client,
        id_address,
        status,
        timestamp,
        created_at,
        updated_at
    )
    VALUES(?,?,?,?,?,?)    
    `;
    //const newUserId = uuidv4(); 
    db.query(sql,[
        order.id_client,
        order.id_address,
        'PAGADO', //1. PAGADO, 2. DESPACHADO, 3.EN CAMINO, 4.ENTREGADO
        Date.now(),
        new Date(),
        new Date()
    ],(err,res)=>{
        if(err){
            console.log('Error:', err)
            result(err,null)
        }else{
            console.log('Id de la order:',res.insertId)
            result(null,res.insertId)
        }
    })
}

Order.getList=(filters,result)=>{
    console.log("filters2",filters)
    const fields = [];
    const values = [];
    let sql = `
        SELECT
            CONVERT(O.id, char) as id,
            CONVERT( O.id_client, char) as id_client,
			CONVERT(O.id_address, char) as id_address,
			CONVERT(O.id_delivery, char) as id_delivery,
            O.status,
            O.timestamp,
            O.created_at,
            O.updated_at,
            JSON_OBJECT(
                'id', CONVERT(A.id,char),
                'address', A.address,
                'neigborhood', A.neighborhood,
                'lat', A.lat,
                'lng', A.lng
            ) as address,
            JSON_OBJECT(
                'id', CONVERT(U.id,char),
                'name', U.name,
                'lastname', U.lastname,
                'image', U.image
            ) as client,
            json_arrayagg(
                JSON_OBJECT(
                    'id', CONVERT(P.id,char),
                    'name', P.name,
                    'description', P.description,
                    'image1', P.image1,
                    'image2', P.image2,
                    'image3', P.image3,
                    'quantity', OHP.quantity
                ) 
            ) as products
        FROM orders as O
        INNER JOIN users as U 
            ON U.id = O.id_client
        INNER JOIN address as A 
            ON A.id = O.id_address
        INNER JOIN order_has_products as OHP 
            ON OHP.id_order = O.id
        INNER JOIN products as P 
            ON P.id = OHP.id_product
    `

    if (Object.keys(filters).length > 0) {
        sql += " WHERE ";
    }

    for (const filter of Object.keys(filters)) {
        try {
            fields.push(`${filter} = ?`);
            values.push(`${filters[filter]}`);
        } catch (error) {
            console.error(`Error al obtener el operador para el filtro ${filter}:`, error);
        }
    }
    
    sql += fields.join(' AND ')  
    sql += "GROUP BY O.id"


    db.query(
        sql,
        values,
        (err,orders)=>{
            if(err){
                console.log('Error:', err)
                result(err,null)
            }else{
                console.log('Orders Obtenidos:',orders)
                result(null,orders)
            }
        })
}


module.exports = Order;