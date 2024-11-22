const ProductoFunct = {}

ProductoFunct.SelectorCompartive = (filter)=>{
    switch(filter)
    {
        case 'name': return 'LIKE'
        case 'description': return 'LIKE'
        case 'price': return '='
        case 'id_category': return '='
    }
}

module.exports = ProductoFunct