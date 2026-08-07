import { Order, Product } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.body.produit);
  if (!product || !product.disponible) {
    return next(ApiError.badRequest("Ce produit n'est pas disponible."));
  }
  const order = await Order.create(req.body);
  res.status(201).json({ success: true, data: order, message: null });
});

export const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("produit", "nomFr nomEn prix");
  res.json({ success: true, data: orders, message: null });
});

export const updateOrderStatut = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { statut: req.body.statut },
    { new: true, runValidators: true }
  );
  if (!order) return next(ApiError.notFound());
  res.json({ success: true, data: order, message: null });
});
