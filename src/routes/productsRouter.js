import { Router } from "express";
import ProductsMongoManager from "../dao/productsMongoManager.js";
import { io } from "../app.js";

export const productsRouter = Router();
const productsManager = new ProductsMongoManager();

productsRouter.get("/", async (req, res) => {
  let { limit, page, sort, query, category, status } = req.query;
  const limitN = parseInt(limit);
  const pageN = parseInt(page);

  const sortManager = {
    asc: 1,
    desc: -1,
  };

  if (!page || isNaN(Number(page))) {
    page = 1;
  }
  if (!limit || isNaN(Number(limit))) {
    limit = 20;
  }

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status === "true";
  }

  if (query) {
    filter = { ...filter, ...query };
  }

  try {
    const productos = await productsManager.getProducts(filter, {
      limit: limitN,
      page: pageN,
      ...(sort && { sort: { price: sortManager[sort] } }),
      customLabels: { docs: "productos" },
    });

    res.status(200).json({ status: "success", payload: productos });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const producto = await productsManager.getProductById(id);
    res.status(200).json({ mensaje: "Producto Encontrado", payload: producto });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const { code } = req.body; 
    console.log(code)
    
    const existingProduct = await productsManager.getProductByCode(code);
    
    if (existingProduct) {
      return res.status(400).json({ mensaje: "El código de producto ya existe" });
    }

    const newProduct = await productsManager.createProduct(req.body);
    const productsList = await productsManager.getProducts();

    io.emit("realtime", productsList);

    res.status(201).json({ mensaje: "Producto Agregado", payload: newProduct });
  } catch (error) {
    res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const product = req.body;
    const updatedProduct = await productsManager.updateProduct(id, product);
    const productsList = await productsManager.getProducts();

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
    const result = await productsManager.deleteProduct(id);
    const productsList = await productsManager.getProducts();

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