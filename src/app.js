import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { productsRouter } from "./routes/productsRouter.js";
import { cartRouter } from "./routes/cartRouter.js";
import homeRoute from "./routes/home.router.js";
import realTimeProducts from "./routes/realtimeproducts.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import ProductsManager  from "./dao/productsManager.js";

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
//Configuracion websockets
let products = []; // Array para los products
io.on("connection", async (socket) => {
  console.log(`Usuario conectado. ID: ${socket.id}`);

  // Enviar la lista de productos actual a la conexión nueva
  try {
    const productsList = await ProductsManager.getProducts(
      "./src/data/products.json"
    );
    socket.emit("home", productsList);
    socket.emit("realtime", productsList);
  } catch (error) {
    console.error("Error al obtener la lista de productos:", error);
  }

  // Evento para añadir un nuevo producto
  socket.on("new-product", async (product) => {
    try {
      const result = await productManager.addProducto(product);
      console.log("Resultado de añadir producto:", result);

      // Enviar la lista de productos actualizada a todos los clientes
      const updatedProducts = await ProductsManager.getProducts(
        "./src/data/products.json"
      );
      io.emit("update-products", updatedProducts);
    } catch (error) {
      console.error("Error al añadir producto:", error);
    }
  });

  // Evento para modificar un producto
  socket.on("modify-product", async (product) => {
    try {
      await productManager.updateProduct(product.info, product.id);
      console.log("ID de producto modificado:", product.id);

      // Enviar la lista de productos actualizada a todos los clientes
      const updatedProducts = await ProductsManager.getProducts(
        "./src/data/products.json"
      );
      io.emit("update-products", updatedProducts);
    } catch (error) {
      console.error("Error al modificar producto:", error);
    }
  });

  // Evento para eliminar un producto
  socket.on("delete-product", async (productId) => {
    console.log("ID recibido para eliminar:", productId);

    try {
      await productManager.deleteProduct(productId);
      console.log("Resultado de eliminación:", result);

      // Enviar la lista de productos actualizada a todos los clientes
      const updatedProducts = await ProductsManager.getProducts(
        "./src/data/products.json"
      );
      io.emit("update-products", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});
// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//exportar server
export { io };
