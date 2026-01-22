import express from "express";
const router = express.Router();
import {validate} from "../middlewares/validate.js";
import { createTourSchema,updateTourSchema } from "../Schemas/tour.schema.js";
import {
  getAlltours,
  monthlyplan,
  getTourStart,
  aliasTopTours,
  getTourByid,
  createTour,
  updateTour,
  deleteTour,
  getTourByName
} from "../controllers/controllers.js";

/**
 * @swagger
 * /api/v1/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of tours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tour'
 */
router.get("/api/v1/tours", getAlltours);

/**
 * @swagger
 * /api/v1/tours/stats:
 *   get:
 *     summary: Get tour statistics
 *     tags: [Tours]
 */
router.get("/api/v1/tours/stats", getTourStart);

/**
 * @swagger
 * /api/v1/tours/plan:
 *   get:
 *     summary: Get monthly tour plan
 *     tags: [Tours]
 */
router.get("/api/v1/tours/plan", monthlyplan);

/**
 * @swagger
 * /api/v1/tours/cheap:
 *   get:
 *     summary: Get cheapest tours
 *     tags: [Tours]
 */
router.get("/api/v1/tours/cheap", aliasTopTours, getAlltours);

/**
 * @swagger
 * /api/v1/tours/name/{name}:
 *   get:
 *     summary: Get tour by name
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/api/v1/tours/name/:name", getTourByName);

/**
 * @swagger
 * /api/v1/tours/{id}:
 *   get:
 *     summary: Get tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/api/v1/tours/:id", getTourByid);

/**
 * @swagger
 * /api/v1/tours:
 *   post:
 *     summary: Create tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 */
router.post("/api/v1/tours", validate(createTourSchema),createTour);

/**
 * @swagger
 * /api/v1/tours/{id}:
 *   patch:
 *     summary: Update tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 */
router.patch("/api/v1/tours/:id", validate(updateTourSchema),updateTour);

/**
 * @swagger
 * /api/v1/tours/{id}:
 *   delete:
 *     summary: Delete tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/api/v1/tours/:id", deleteTour);

export default router;
