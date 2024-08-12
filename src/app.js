import express from 'express';
import {productsRouter} from './routes/productsRouter.js';
import {cartRouter} from './routes/cartRouter.js';
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)

app.get("/" ,(req,res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
})

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
})