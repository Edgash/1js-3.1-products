const Category = require('./category.class');
const Product = require('./product.class');

// Aquí la clase Store

class Store{
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.products = [];
        this.categories = [];
    }

    getCategoryById(id){
        let categoria = this.categories.find(elementoID => elementoID.id === id);
        if(!categoria){
            throw "No existe esta categoria";
        }
        return categoria;
    }

    getCategoryByName(name){
        let categoria = this.categories.find(cat => cat.name.toUpperCase() === name.toUpperCase());
        if(!categoria){
        throw "No existe esta categoria";
        }
        return categoria;
    }

    getProductById(id){
        let producto = this.products.find(prod => prod.id === id);
        if(!producto){
            throw "No existe este producto";
        }
        return producto;
    }

    getProductsByCategory(id){
        return this.products.filter(prod => prod.category === id);
    }

    addCategory(nombre, descripcion){
        if(!nombre){
            throw "Error al añadir una categoria.";
        }
        try{
            this.getCategoryByName(nombre);
        }catch (err){
            let buscarID = this.categories.reduce((acum, categoria) => acum > categoria.id ? acum : categoria.id, 0) + 1;
            let categoria = new Category(buscarID, nombre, descripcion);
            this.categories.push(categoria);
            return categoria;
        }
        throw "Ya existe una categoria con ese nombre.";
    }

    addProduct(payload){
        if(!payload.name){
            throw "Nombre no válido.";
        }else if(!payload.category || !this.getCategoryById(payload.category)){
            throw "Categoria no válida.";
        }else if(!payload.price || payload.price < 0 || isNaN(payload.price)){
            throw "Precio no válido.";
        }else if(payload.units && isNaN(payload.units)){
            throw "Unidad no válida.";
        }else if (payload.units && !Number.isInteger(payload.units)){
            throw "No es un número entero.";
        }else if(payload.units < 0){
            throw "Unidad no válida.";
        }
        let buscarID = this.products.reduce((acum, prod) => acum > prod.id ? acum : prod.id, 0) + 1;
        let producto = new Product(buscarID, payload.name, payload.category, payload.price, payload.units);
        this.products.push(producto);
        return producto;
    }

    delCategory(id){
        try{
            var cat = this.getCategoryById(id);
        }catch(err){
            throw "No puedes borrar esta categoria porque tiene productos.";
        }
        if(cat.units > 0){
            throw "No puedes borrar esta categoria porque tiene productos.";
        }
        if(this.products.filter(prod => prod.category === cat.id).length > 0){
            throw "No se puede borrar una categoria con un producto.";
        }

        let index = this.categories.findIndex(cat => cat.id === id);
        let array = this.categories.splice(index, 1);
        return array[0];
    }

    delProduct(id){
        try{
            var prod = this.getProductById(id);
        }catch(err){
            throw "No puedes borrar este producto porque tiene productos.";
        }
        if(prod.units > 0){
            throw "No puedes borrar este producto porque tiene productos.";
        }
        let index = this.products.findIndex(prod => prod.id === id);
        let array = this.products.splice(index, 1);
        return array[0];
    }

    totalImport(){
        return this.products.reduce((acum, valor) => acum += valor.productImport(), 0);
    }

    orderByUnitsDesc(){
        return this.products.sort((product1, product2) => product2.units-product1.units);
    }

    orderByName(){
        return this.products.sort((product1, product2) => product1.name.localeCompare(product2.name));
    }

    underStock(units){
        return this.products.filter(prod => prod.units < units);
    }

    toString(){
        return "";
    }
}


module.exports = Store
