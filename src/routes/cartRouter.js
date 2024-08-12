import { Router } from "express";
import { CartManager } from "../dao/cartManager.js";
const cartManager = new CartManager("./src/data/cart.json");
await cartManager.init();
export const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const cart = req.body;
    const mensaje = await cartManager.createCart(cart);
    if (mensaje == "Carrito creado con éxito") {
      res.setHeader("Content-type", "application/json");
      res.status(200).send(mensaje);
    } else {
      res.status(400).send(mensaje);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al crear producto : ${error}`);
  }
});

/* La ruta **GET /:cid** listará los productos del carrito con el **cid** proporcionado. */

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await CartManager.getCart(cartManager.path);
    let id = req.params.cid;
    if (id) {
      let filtradoPorId = cart.filter((cart) => cart.id === parseInt(id));
      res.setHeader("Content-type", "application/json");
      return res.status(200).json({ payload: filtradoPorId });
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* La ruta POST /:cid/product/:pid agregará un producto al arreglo products del carrito, bajo el formato:
  
product: solo debe contener el id del producto.
quantity: número de ejemplares del producto (se agrega de uno en uno). */

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
    return res.status(200).send(mensaje);
  } catch (error) {
    res
      .status(500)
      .send(
        `Error interno del servidor al añadir producto al carrito : ${error}`
      );
  }
});
