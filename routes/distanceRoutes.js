const express = require("express");
const router = express.Router();
const {getDistance} = require('../controllers/distanceController');
const validateToken = require('../middleware/validateTokenHandler')

/**
 * @swagger
 * tags:
 *   name: Distance
 *   description: Endpoints for calculating distance between two coordinates
 */

/**
 * @swagger
 * /api/distance:
 *   post:
 *     summary: Calculate distance between two coordinates
 *     description: Calculate the Haversine distance between two sets of coordinates
 *     tags: [Distance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coordinate1:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               coordinate2:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the calculated Haversine distance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: Success message
 *                 Distance in Meters:
 *                   type: number
 *                   description: Calculated Haversine distance in meters
 */
router.post('/',validateToken,getDistance);



module.exports = router;