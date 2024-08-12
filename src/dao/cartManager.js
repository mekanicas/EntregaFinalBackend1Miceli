import { promises as fs } from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
    this.cart = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.cart = JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async createCart(cart) {
    let id = 1;
    let products = [];
    cart.products = products;
    if (this.cart.length > 0) {
      id = this.cart[this.cart.length - 1].id + 1;
    }
    cart.id = id;
    this.cart.push(cart);
    await this.saveCarts();
    console.log(cart);
    return "Carrito creado con éxito";
  }
   async saveCarts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.cart, null, 2));
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }

  static async getCart(path) {
    try {
      const data = await fs.readFile(path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      let filtradoPorId = this.cart.filter((cart) => cart.id === cartId);
      const existe = filtradoPorId[0].products.findIndex(
        (prod) => prod.id == productId
      );
      if (existe != -1) {
        filtradoPorId[0].products[existe].quantity += quantity;
        console.log(filtradoPorId[0].products[existe]);
      } else {
        const prod = { id: productId, quantity: quantity };
        filtradoPorId[0].products.push(prod);
      }
      await this.saveCarts();
      return "Producto cargado"
    } catch (error) {
      console.error("Error al añadir los productos:", error);
    }
  }
}
