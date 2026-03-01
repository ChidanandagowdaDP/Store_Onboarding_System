import express from "express";
import {
  createStore,
  getMyStores,
  getStores,
  updateStore,
  renewStore,
  deleteStore,
  updatePayment,
} from "../controllers/storeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/create", authMiddleware, roleMiddleware("user"), createStore);
router.get("/my-stores", authMiddleware, getMyStores);
router.get("/getstores", authMiddleware, roleMiddleware("admin"), getStores);
router.delete("/deletestore/:id", authMiddleware, deleteStore);
router.patch(
  "/updatestore/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateStore,
);
router.patch(
  "/renewStore/:id",
  authMiddleware,
  roleMiddleware("admin"),
  renewStore,
);
router.patch(
  "/updatepayment/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updatePayment,
);
export default router;
