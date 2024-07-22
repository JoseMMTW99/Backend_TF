class ProductDto {
    constructor(product) {
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.category = product.category;
        this.stock = product.stock;
    }
}

module.exports = ProductDto;