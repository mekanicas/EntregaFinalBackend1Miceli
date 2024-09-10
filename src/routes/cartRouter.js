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
    const cart = await CartModel.create({products:[]})
    res.status(201).json({ mensaje: "Carrito creado", cart });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Agregar un Producto a un Carrito

cartRouter.put("/:cid/product/:pid", async(req, res) => {
  const {cid, pid} = req.params;
  const cartSelect = await CartModel.findById(cid)
  const indexProd = cartSelect.products.findIndex(prod => prod.product.toString() === pid);
  if(indexProd === -1){
    cartSelect.products.push({product: pid, quantity: 1})
  }else{
    cartSelect.products[indexProd] = {product: cartSelect.products[indexProd].product, quantity: cartSelect.products[indexProd].quantity + 1}
  }
  const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartSelect, {new : true}).populate('products.product')
  res.status(200).json({"mensaje": "Producto agregado al carrito", "payload": {cartUpdated}})
})

cartRouter.put("/:cid", async(req, res) => {
  const { cid } = req.params;
  const { products } = req.body; // Suponemos que products es un arreglo con productos y cantidades
  
  try {
    let cartSelect = await CartModel.findById(cid);
    if (!cartSelect) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
    cartSelect.products = products;
    // Iteramos sobre los productos recibidos en el body

    // Guardamos los cambios
    const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartSelect, { new: true }).populate('products.product');

    res.status(200).json({ mensaje: "Carrito actualizado", payload: { cartUpdated } });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el carrito", error });
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
