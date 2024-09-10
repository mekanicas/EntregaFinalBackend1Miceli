import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { productsRouter } from "./routes/productsRouter.js";
import { cartRouter } from "./routes/cartRouter.js";
import { CartModel } from "./dao/models/cart.model.js";
import homeRoute from "./routes/home.router.js";
import cartView from "./routes/cartview.js"
import realTimeProducts from "./routes/realtimeproducts.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import ProductsManager  from "./dao/productsManager.js";
import { connDB } from "./connDB.js";
import { productsModel } from "./dao/models/productsModel.js";
import mongoose from "mongoose";


connDB()
const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;
const productManager = new ProductsManager("./src/data/products.json");
await productManager.init();

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "/public")));
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Rutas
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/cart", cartView)
app.use("/home", homeRoute);
app.use("/realtimeproducts", realTimeProducts);
// Rutas de vistas
app.get("/", (req, res) => {
  let testUser = {
    name: "Bruno",
    last_name: "Miceli",
  };
  res.render("index", testUser);
});
// Configuración de WebSockets
io.on("connection", async (socket) => {
  console.log(`Usuario conectado. ID: ${socket.id}`);

  try {
    // Enviar productos actuales al conectar
    const productsList = await productsModel.find().lean();
    socket.emit("home", productsList);
    socket.emit("realtime", productsList);

    const cid = "66da81458c031bf6201de190"; // Ejemplo de ID de carrito
    const newCart = await CartModel.findById(cid).populate("products.product");
    socket.emit("cart", newCart);
  } catch (error) {
    console.error("Error al obtener la lista de productos:", error);
  }

  // Evento para añadir un nuevo producto
  socket.on("new-product", async (product) => {
    try {
      // Agregar el nuevo producto a la base de datos usando ProductModel
      const result = await productsModel.create(product);
      console.log("Resultado de añadir producto:", result);

      // Obtener la lista actualizada de productos desde la base de datos
      const updatedProducts = await productsModel.find().lean();

      // Emitir la lista actualizada a todos los clientes conectados
      io.emit("update-products", updatedProducts);
    } catch (error) {
      console.error("Error al añadir producto:", error);
    }
  });

  // Evento para modificar un producto
  socket.on("modificar-producto", async ({ id, info }) => {
    try {
      // Actualizar el producto en la base de datos usando el ID y la información proporcionada
      await productsModel.findByIdAndUpdate(id, info, { new: true });

      // Obtener la lista actualizada de productos
      const productsList = await productsModel.find().lean();

      // Emitir la lista actualizada a todos los clientes conectados
      io.emit("update-products", productsList);
    } catch (error) {
      console.error("Error al modificar el producto:", error);
    }
  });

  // Evento para eliminar un producto
  socket.on("delete-product", async (id) => {
    console.log("ID recibido para eliminar:", id);

    try {
      // Eliminar el producto usando ProductModel
      await productsModel.findByIdAndDelete(id);
      console.log("Producto eliminado");

      // Obtener la lista actualizada de productos desde la base de datos
      const updatedProducts = await productsModel.find().lean();

      // Emitir la lista actualizada a todos los clientes conectados
      io.emit("update-products", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  socket.on("agregar-a-carrito", async (pid) => {
    const cid = "66da81458c031bf6201de190"; //carrito estatico de ejemplo
    const cartSelect = await CartModel.findById(cid);
    console.log(cartSelect)
    const indexProd = cartSelect.products.findIndex(
      (prod) => prod.product.toString() === pid
    );
    if (indexProd === -1) {
      cartSelect.products.push({ product: pid, quantity: 1 });
    } else {
      cartSelect.products[indexProd] = {
        product: cartSelect.products[indexProd].product,
        quantity: cartSelect.products[indexProd].quantity + 1,
      };
    }
    const newCart = await CartModel.findByIdAndUpdate(cid, cartSelect, {
      new: true,
    }).populate("products.product");

    socketServer.emit("cart", newCart);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exportar server
export { io };
