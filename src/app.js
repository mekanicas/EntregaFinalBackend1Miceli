import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { productsRouter } from "./routes/productsRouter.js";
import { cartRouter } from "./routes/cartRouter.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { ProductsManager } from "./dao/productsManager.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Rutas
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
// Rutas de vistas
app.get("/", (req, res) => {
  let testUser = {
    name: "Bruno",
    last_name: "Miceli",
  };
  res.render("index", testUser);
});
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});
//Configuracion websockets
let products = []; // Array para los products

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("new-product", async (product) => {
    await ProductsManager.addProducto(product);
    const updatedProducts = await ProductsManager.getProducts(
      "./src/data/products.json"
    );
    io.emit("update-products", updatedProducts);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});
// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
