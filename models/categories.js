const db =  require('../config/config')
const Category = {}

Category.create=(category,result)=>{
    const sql = `
        INSERT INTO 
        categories(
            name, 
            description,
            image,
            created_at,
            updated_at,
        )
        VALUES(?,?,?,?,?)
    `
    db.query(
        sql,
        [
            category.name,
            category.description,
            category.image,
            new Date(),
            new Date()
        ],
        (err,res)=>{
            if(err){
                console.log('Error:', err)
                result(err,null)
            }else{
                console.log('Categoria Creada:',res.insertId)
                result(null,res.insertId)
            }
        }
    )
}

Category.findByid = (id, result) =>{
    const sql = `
        SELECT 
            name, 
            description,
            image,     
        FROM categories
        WHERE id = ? 
    `
    db.query(
        sql,
        [id],
        (err,user)=>{
            if(err){
                console.log('Error:', err)
                result(err,null)
            }else{
                console.log('Categoria Obtenido:',user[0])
                result(null,user[0])
            }
        })
}
