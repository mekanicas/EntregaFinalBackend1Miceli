import { Router } from "express";

const vistasRouter = Router();

vistasRouter.get("/cart", (req, res) => {
    res.render("cart");
});

vistasRouter.get("/products", (req, res) => {
    res.render("home");
});

vistasRouter.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export default vistasRouter;
