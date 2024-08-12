import { products } from "../data/products.js";
import { promises as fs } from "fs";

export class ProductsManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async addProducto(product) {
    console.log(product);
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnail",
    ];
    const missingFields = requiredFields.filter((field) => !product[field]);
    if (missingFields > 0) {
      return `Faltan campos obligatorios : ${missingFields.join(", ")}`;
    }
    const existe = this.products.findIndex((prod) => prod.id == product.id);
    if (existe != -1) {
      this.products[existe].stock += product.stock;
      await this.saveProducts();
      return `Producto agregado al stock existente, stock : ${this.products[existe].stock}`;
    }
    let id = 1;
    if (this.products.length > 0) {
      id = this.products[this.products.length - 1].id + 1;
    }
    product.id = id;
    this.products.push(product);
    await this.saveProducts();
    return "Producto agregado con exito";
  }
  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }
  static async getProducts(path) {
    try {
      const data = await fs.readFile(path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async refreshProduct(product, id) {
    const indiceProducto = this.products.findIndex((prod) => prod.id == id);
    if (indiceProducto != -1) {
      this.products[indiceProducto] = {
        ...this.products[indiceProducto],
        ...product,
      };
      await this.saveProducts();
      return `Producto modificado correctamente : ${this.products[indiceProducto]}`;
    } else {
      return "Producto no existente";
    }
  }

  async deleteProduct(id) {
    const indiceProducto = this.products.findIndex((prod) => prod.id == id);
    if (indiceProducto != -1) {
      this.products.splice(indiceProducto, 1);
      await this.saveProducts();
      return `Producto eliminado correctamente : ${this.products[indiceProducto]}`;
    } else {
      return "Producto no existente";
    }
  }
}
