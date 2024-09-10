import { Router } from "express";
import ProductsManager from "../dao/productsManager.js";
import { productsModel } from "../dao/models/productsModel.js";
import __dirname from "../utils.js";
import { io } from "../app.js";

export const productsRouter = Router();
const productManager = new ProductsManager("./src/data/products.json");
await productManager.init();


productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", ...query } = req.query;
    const limitN = parseInt(limit);
    const pageN = parseInt(page);

    const sortManager = {
      asc: 1,
      desc: -1,
    };

    const productos = await productsModel.paginate(
      { ...query },
      {
        limit: limitN,
        page: pageN,
        ...(sort && { sort: { price: sortManager[sort] } }),
        customLabels: { docs: "Productos" },
      }
    );

    res
      .status(200)
      .json({ mensaje: "Productos Encontrados", payload: productos });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const producto = await productsModel.findById(id).lean();
    res.status(200).json({ mensaje: "Producto Encontrado", payload: producto });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productsModel.create(product);
    const productsList = await productsModel.find().lean();

    // Emitir la lista actualizada de productos
    io.emit("realtime", productsList);

    res.status(201).json({ mensaje: "Producto Agregado", payload: newProduct });
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al crear producto: ${error}`);
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const product = req.body;
    const updatedProduct = await productsModel
      .findByIdAndUpdate(id, product, { new: true })
      .lean();
    const productsList = await productsModel.find().lean();

    // Emitir la lista actualizada de productos
    io.emit("realtime", productsList);

    if (updatedProduct) {
      res
        .status(200)
        .json({ mensaje: "Producto Modificado", payload: updatedProduct });
    } else {
      res.status(400).json({ mensaje: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al modificar producto: ${error}`);
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const result = await productsModel.findByIdAndDelete(id);
    const productsList = await productsModel.find().lean();

    // Emitir la lista actualizada de productos
    io.emit("realtime", productsList);

    if (result) {
      res.status(200).json({ mensaje: "Producto Eliminado", payload: id });
    } else {
      res.status(400).json({ mensaje: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al eliminar producto: ${error}`);
  }
});

export default productsRouter;
