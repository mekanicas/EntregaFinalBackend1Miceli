import { Router } from "express";
import { ProductsManager } from "../dao/productsManager.js";
const productManager = new ProductsManager("./src/data/products.json");
await productManager.init();
export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const limite = limit !== undefined ? limit : 50;
  let productos = await ProductsManager.getProducts(productManager.path);
  if (productos.length > limite) {
    productos = productos.slice(0, limite);
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(200).send(productos)
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    let productos = await ProductsManager.getProducts(productManager.path);
    let idNum = parseInt(id, 10);

    if (id) {
      let filtradoPorId = productos.filter((producto) => producto.id === idNum);
      console.log(productos);
      res.setHeader("Content-type", "application/json");
      return res.status(200).json({ payload: filtradoPorId });
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const mensaje = await productManager.addProducto(product);
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
    const mensaje = await productManager.refreshProduct(product, id);
    if (mensaje == "El producto se actualizó correctamente") {
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
