import { Router } from "express";
import ProductsManager from "../dao/productsManager.js";
const productManager = new ProductsManager("./src/data/products.json");
await productManager.init();
export const productsRouter = Router();
import __dirname from "../utils.js"
import { io } from "../app.js"
import { productsModel } from "../dao/models/productsModel.js";



productsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const limite = limit !== undefined ? limit : 50;
  //let productos = await ProductsManager.getProducts(productManager.path);
  let productos = await productsModel.find().lean();
  if (productos.length > limite) {
    productos = productos.slice(0, limite);
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(200).send(productos)
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    //let productos = await ProductsManager.getProducts(productManager.path);
    let productos = await productsModel.findById(id).lean()
    return res.status(200).send(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const mensaje = await productsModel.create(product);
    console.log(product)
    io.emit("realtime", products);
    if (mensaje == "Producto agregado con exito") {
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

productsRouter.put("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    const product = req.body;
    console.log(product)
    //io.emit("realtime", products);
    const mensaje = await productsModel.findByIdAndUpdate(id, product, {new:true}).lean();
    if (mensaje) {
      res.setHeader("Content-type", "application/json");
      res.status(200).send(mensaje);
    } else {
      res.status(400).send(mensaje);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al modificar producto : ${error}`);
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    const mensaje = await productManager.deleteProduct(id);
    io.emit("realtime", products);
    if (mensaje == "El producto se eliminó correctamente") {
      res.setHeader("Content-type", "application/json");
      res.status(200).send(mensaje);
    } else {
      res.status(400).send(mensaje);
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al eliminar producto : ${error}`);
  }
});
