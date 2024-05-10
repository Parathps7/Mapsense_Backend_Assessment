const express = require("express");
const router = express.Router();
const {createLocation,viewLocation,deleteLocation} = require('../controllers/locationController');
const validateToken = require('../middleware/validateTokenHandler')

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: Endpoints for adding & managing locations
 */

/**
 * @swagger
 * /api/location/add:
 *   post:
 *     summary: Create a new location
 *     description: Add a new location with provided latitude and longitude
 *     tags: [Location]
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
 *       '201':
 *         description: Location created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *                   description: Success message
 *                 Location:
 *                   type: object
 *                   description: Created location details
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       description: Latitude of the created location
 *                     longitude:
 *                       type: number
 *                       description: Longitude of the created location
 */
router.post('/add',validateToken,createLocation);

/**
 * @swagger
 * /api/location/view:
 *   get:
 *     summary: View locations
 *     description: View all locations corresponding to user
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Locations found successfully.
 */

router.get('/view',validateToken,viewLocation);


/**
 * @swagger
 * /api/location/delete/{id}:
 *   delete:
 *     summary: Remove a location from favourites.
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: location with ID removed.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response.
 *       '400':
 *         description: Stock not found or permission issue.
 */

router.delete('/delete/:id',validateToken,deleteLocation);

module.exports = router;