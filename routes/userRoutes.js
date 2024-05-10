const express = require('express')
const router = express.Router()
const {registerUser,loginUser,currentUser,forgetpassword, resetpassword} = require('../controllers/userController');
const validate = require('../middleware/validateTokenHandler')


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations related to user management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: A successful response with the registered user details.
 *       '400':
 *         description: User data not valid or user already registered.
 */
router.post('/register',registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response with the access token.
 *       '401':
 *         description: Email or password not valid.
 */
router.post('/login',loginUser);

/**
 * @swagger
 * /api/users/forget-password:
 *   post:
 *     summary: Send a reset password token to reset password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: A successful response.
 *       '404':
 *         description: No given email found!
 */


//forgot password
router.post('/forget-password',forgetpassword);


/**
 * @swagger
 * /api/users/reset-password/{token}:
 *   post:
 *     summary: Send a reset password token to reset password.
 *     tags: [Users]
*     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: ID of the favourite stock to be removed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response.
 *       '404':
 *         description: No given email found!
 *       '401':
 *         description: Not updated.Try again!
 */

//reset password
router.post('/reset-password/:token',resetpassword);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get current user information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the current user details.
 */
router.get('/current',validate,currentUser);

module.exports = router;