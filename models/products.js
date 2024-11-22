const db  = require('../config/config')
const ProductoFunct = require('../functions/products')
const Producto = {};

Producto.create = async (producto, result)=>{
    console.log("productoCrear",producto)
    const sql = `INSERT INTO products(
        name,
        description,
        price,
        image1,
        image2,
        image3, 
        id_category, 
        created_at,
        updated_at
    )
    VALUES(?,?,?,?,?,?,?,?,?)    
    `;
    //const newUserId = uuidv4(); 
    db.query(sql,[
        producto.name,
        producto.description,
        producto.price,
        producto.image1||null,
        producto.image2||null,
        producto.image3||null,
        1,
        new Date(),
        new Date()
    ],(err,res)=>{
        if(err){
            console.log('Error:', err)
            result(err,null)
        }else{
            console.log('Id del nuevo producto:',res.insertId)
            result(null,res.insertId)
        }
    })
}

Producto.findByid = (id, result) =>{
    console.log("///////////id:",id)
    const sql = `
        SELECT 
            name,
            description,
            price,
            image1,
            image2,
            image3, 
            id_category, 
            created_at,
            updated_at
        FROM products
        where id= ?
        ;
    `
    db.query(
        sql,
        [id],
        (err,user)=>{
            if(err){
                console.log('Error:', err)
                result(err,null)
            }else{
                console.log('Producto Obtenido:',user[0])
                result(null,user[0])
            }
        })
}

Producto.getList=(filters,result)=>{
    const fields = [];
    const values = [];
    let sql = `
        SELECT
            id,
            name,
            description,
            price,
            image1,
            image2,
            image3, 
            id_category, 
            created_at,
            updated_at
        FROM products 
        WHERE 
    `

    /*Object.keys(filters).forEach(async (filter, index) => {
        const action =  await ProductoFunct.SelectorCompartive(filter)
        console.log("action",action)
        fields.push(`${filter} ${action} ?`);   // Muestra el índice y el nombre del campo
        values.push(`${action==="LIKE"?`%${filters[filter]}%`:filters[filter]}`);        // Muestra el valor
    });*/

    for (const filter of Object.keys(filters)) {
        try {
            // Asignamos el operador adecuado usando la función asíncrona
            const action =  ProductoFunct.SelectorCompartive(filter);
            console.log("action", action);
            
            // Agregamos el campo con el operador a la lista de campos
            fields.push(`${filter} ${action} ?`);
            
            // Si el operador es LIKE, rodeamos el valor con los comodines '%' 
            if (action === "LIKE") {
                values.push(`%${filters[filter]}%`);
            } else {
                values.push(filters[filter]);
            }
        } catch (error) {
            console.error(`Error al obtener el operador para el filtro ${filter}:`, error);
        }
    }
    
    sql += fields.join(' AND ')  

    /*for (const filter in filters) {
        fields.push(`${filter} = ?`);   //nombre del campo
        values.push(`${filters[filter]} `);   //valor
    }*/

    db.query(
        sql,
        values,
        (err,productos)=>{
            if(err){
                console.log('Error:', err)
                result(err,null)
            }else{
                console.log('Productos Obtenidos:',productos)
                result(null,productos)
            }
        })
}

module.exports = Producto;