import { Router } from "express";
import { CartManager } from "../dao/cartManager.js";
import __dirname from "../utils.js";
import { CartModel } from "../dao/models/cart.model.js";

const cartManager = new CartManager(__dirname + CartManager); // Ajusta la ruta del archivo según tu estructura de directorios
await cartManager.init();

export const cartRouter = Router();

// Buscar Todos Los Carritos Existentes.
cartRouter.get("/", async (req, res) => {
  try {
    const cartList = await CartModel.find().populate("products.product");
    res.status(200).json(cartList);
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Buscar un carrito por ID
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartManager.getCart(cartManager.path);
    if (cid) {
      let filtradoPorId = cart.find((cart) => cart.id === parseInt(cid));
      if (filtradoPorId) {
        res.status(200).json({ payload: filtradoPorId });
      } else {
        res.status(404).json({ error: "Carrito no encontrado" });
      }
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un nuevo carrito vacío
cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({ mensaje: "Carrito creado", payload: cart });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Agregar un Producto a un Carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;
    const mensaje = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.status(200).json({ mensaje });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un carrito
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await CartModel.findByIdAndDelete(cid);
    res.status(200).json({ message: "Carrito Eliminado" });
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un producto de un carrito
cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carrito = await CartModel.findById(cid).lean();
    const cartFiltered = {
      ...carrito,
      products: carrito.products.filter(
        (prod) => prod.product.toString() !== pid
      ),
    };
    const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartFiltered, {
      new: true,
    }).populate("products.product");
    res
      .status(200)
      .json({ message: "Producto Eliminado del carrito", cart: cartUpdated });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
