// src/dao/managers/CartsMongoManager.js
import { CartModel } from "./models/cart.model.js";

class CartsMongoManager {
  async getCarts() {
    try {
      const carts = await CartModel.find().populate("products.product");
      return carts;
    } catch (error) {
      throw new Error("Error al obtener los carritos: " + error.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await CartModel.findById(id).populate("products.product");
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async createCart() {
    try {
      const cart = await CartModel.create({ products: [] });
      return cart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async updateCart(id, products) {
    try {
      let cart = await CartModel.findById(id);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = products;
      const updatedCart = await CartModel.findByIdAndUpdate(id, cart, {
        new: true,
      }).populate("products.product");
      return updatedCart;
    } catch (error) {
      throw new Error("Error al actualizar el carrito: " + error.message);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const indexProd = cart.products.findIndex(
        (prod) => prod.product.toString() === productId
      );

      if (indexProd === -1) {
        cart.products.push({ product: productId, quantity: 1 });
      } else {
        cart.products[indexProd].quantity += 1;
      }

      const updatedCart = await CartModel.findByIdAndUpdate(cartId, cart, {
        new: true,
      }).populate("products.product");
      return updatedCart;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }

  async deleteCart(id) {
    try {
      await CartModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar el carrito: " + error.message);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      cart.products = cart.products.filter(
        (prod) => prod.product.toString() !== productId
      );

      const updatedCart = await CartModel.findByIdAndUpdate(cartId, cart, {
        new: true,
      }).populate("products.product");
      return updatedCart;
    } catch (error) {
      throw new Error(
        "Error al eliminar producto del carrito: " + error.message
      );
    }
  }
}

export default CartsMongoManager;
