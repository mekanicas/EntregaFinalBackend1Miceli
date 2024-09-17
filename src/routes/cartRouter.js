// src/routes/cartRouter.js
import { Router } from "express";
import CartsMongoManager from "../dao/cartsMongoManager.js";

const cartsManager = new CartsMongoManager();

export const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  try {
    const cartList = await cartsManager.getCarts();
    res.status(200).json(cartList);
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.getCartById(req.params.cid);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.status(201).json({ mensaje: "Carrito creado", cart: newCart });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  const { products } = req.body;

  try {
    const updatedCart = await cartsManager.updateCart(req.params.cid, products);
    res
      .status(200)
      .json({ mensaje: "Carrito actualizado", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el carrito", error });
  }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartsManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    if (updatedCart) {
      res.status(200).json({ mensaje: "Producto agregado al carrito", payload: updatedCart });
    } else {
      res.status(404).json({ mensaje: "El carrito no existe" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar producto al carrito", error });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    await cartsManager.deleteCart(req.params.cid);
    res.status(200).json({ mensaje: "Carrito eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el carrito", error });
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const updatedCart = await cartsManager.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res
      .status(200)
      .json({ mensaje: "Producto eliminado del carrito", cart: updatedCart });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar producto del carrito", error });
  }
});

export default cartRouter;
