import express from 'express';
import {productsRouter} from './routes/productsRouter.js';
import {cartRouter} from './routes/cartRouter.js';

import handlebars from 'express-handlebars'
import __dirname from './utils.js'

const app = express();
const PORT = 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars')
app.use(express.static(__dirname+'public'))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)

app.get("/" ,(req,res) => {
    let testUser = {
        name : "Bruno",
        last_name : "Miceli"
    }
    res.render('index', testUser)
})

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en el puerto ${PORT}`);
})