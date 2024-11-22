const db  = require('../config/config')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs')
const User = {};

User.findByid = (id, result) =>{
    console.log("///////////id:",id)
    const sql = `
        SELECT 
            U.id,
            U.email,
            U.name,
            U.lastname,
            U.phone,
            U.cedula,
            U.image,
            U.password,      
            json_arrayagg(
				JSON_OBJECT(
					'id', CONVERT(R.id,char),
                    'name', R.name,
                    'image', R.image,
                    'route', R.route
                ) 
            ) as roles
        FROM users as U 
        inner join user_has_roles  as UR 
        on U.id = UR.id_user
        inner join roles as R
        on R.id = UR.id_rol
        where U.id = ?
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
                console.log('Usuario Obtenido:',user[0])
                result(null,user[0])
            }
        })
}

User.update = (id,updateFields, result)=>{
    let sql = 'UPDATE users SET ';
    const fields = [];
    const values = [];

    // Iterar sobre los campos proporcionados en la solicitud
    for (const field in updateFields) {
        fields.push(`${field} = ?`);
        values.push(updateFields[field]);
    }

    // Agregar el campo updated_at para la marca de tiempo
    fields.push('updated_at = ?');
    values.push(new Date());

    // Completar la consulta SQL
    sql += fields.join(', ') + ' WHERE id = ?';
    values.push(id);

    db.query(
        sql,
        values,
        (err,user)=>{
            if (err) {
                console.log('Error:', err)
                result(err,null)
            }else{
                console.log('Usuario actualizado:',user)
                result(null,user)
            }
        });
}

User.findByemail = (email, result) =>{
    const sql = `
                SELECT 
            U.id,
            U.email,
            U.name,
            U.lastname,
            U.phone,
            U.cedula,
            U.image,
            U.password,      
            json_arrayagg(
				JSON_OBJECT(
					'id', CONVERT(R.id,char),
                    'name', R.name,
                    'image', R.image,
                    'route', R.route
                ) 
            ) as roles
        FROM users as U 
        inner join user_has_roles  as UR 
        on U.id = UR.id_user
        inner join roles as R
        on R.id = UR.id_rol
        where email = ?
    `
    db.query(
        sql,
        [email],
        (err,user)=>{
            if(err){
                console.log('Error:', err)
                result(err,null)
            }else{
                console.log('Usuario Obtenido:',user[0])
                result(null,user[0])
            }
        })
}

User.create = async (user, result)=>{
    const hash = await bcrypt.hash(user.password,10)
    const sql = `INSERT INTO users(
        id,
        email,
        name,
        lastname,
        phone,
        password, 
        cedula, 
        created_at,
        updated_at
    )
    VALUES(?,?,?,?,?,?,?,?,?)    
    `;
    const newUserId = uuidv4(); 
    db.query(sql,[
        newUserId,
        user.email,
        user.name,
        user.lastname,
        user.phone,
        hash,
        "Profesional",
        new Date(),
        new Date()
    ],(err,res)=>{
        if(err){
            console.log('Error:', err)
            result(err,null)
        }else{
            console.log('Id del nuevo user:',newUserId)
            result(null,newUserId)
        }
    })
}

module.exports = User;