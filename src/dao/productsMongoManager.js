import { productsModel } from "./models/productsModel.js";

class ProductsMongoManager {
  async getProducts(filter = {}, options = {}) {
    try {
      const products = await productsModel.paginate(filter, options);
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos: " + error.message);
    }
  }

  async getProductById(id) {
    try {
      const product = await productsModel.findById(id).lean();
      return product;
    } catch (error) {
      throw new Error("Error al obtener el producto: " + error.message);
    }
  }
  async getProductByCode(code) {
    try {
      const product = await productsModel.findOne({ code });
      return product;
    } catch (error) {
      throw new Error(
        "Error al buscar el producto por código: " + error.message
      );
    }
  }

  async createProduct(productData) {
    try {
      const newProduct = await productsModel.create(productData);
      return newProduct;
    } catch (error) {
      throw new Error("Error al crear el producto: " + error.message);
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await productsModel
        .findByIdAndUpdate(id, productData, { new: true })
        .lean();
      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar el producto: " + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const result = await productsModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }
}

export default ProductsMongoManager;
