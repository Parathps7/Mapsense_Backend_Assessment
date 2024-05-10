const express = require("express");
const router = express.Router();
const {getClosest} = require('../controllers/closestController');
const validateToken = require('../middleware/validateTokenHandler')

/**
 * @swagger
 * tags:
 *   name: Closest
 *   description: Endpoints for finding the closest location
 */

/**
 * @swagger
 * /api/closest:
 *   post:
 *     summary: Get closest location
 *     description: Retrieve the closest location based on provided latitude and longitude
 *     tags: [Closest]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: Latitude of the location
 *               longitude:
 *                 type: number
 *                 description: Longitude of the location
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the closest location.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: Success message
 *                 Closest Distance in Meters:
 *                   type: number
 *                   description: Distance to the closest location in meters
 *                 Location:
 *                   type: object
 *                   description: Closest location details
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: Latitude of the closest location
 *                     longitude:
 *                       type: number
 *                       description: Longitude of the closest location
 */
router.post('/',validateToken,getClosest);

module.exports = router;