const express = require("express");
const dotenv = require("dotenv").config();
const xss = require("xss-clean")
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middleware/errorHandler")
const app = express();
const cors = require('cors');
const connectDb = require('./Config/dbConnection')
const port = process.env.PORT || 3000;

//using middleware
app.use(express.json({limit:'50kb'}))
app.use(cors());

// Security vulnerability check
//1. Data sanitization against XSS attacks
app.use(xss())

//2.Rate limiting - prevent DOS
const rateLimiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: "Too many message,please try again"
})
app.use(rateLimiter)


//3.HTTP Security headers security
app.use(helmet())


//4.Prevent NoSQL query injection
app.use(mongoSanitize())

//connect to db
connectDb();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: "Location-based Service API",
        version: "1.0.0",
        description: "API documentation for the Location Services Assesment",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    in: 'header',
                    name: 'Authorization',
                    description: 'Bearer Token',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        servers: [
        {
            url: `http://localhost:${port}`,
            description: "Development server",
        },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes setup
app.get('/',(req,res)=>{
    res.send("App Running");
});



const randomRoute = require('./routes/randomCoordinates');
app.use('/api',randomRoute);
const locationRoute = require('./routes/locationRoutes');
app.use('/api/location',locationRoute);
const distanceRoute = require('./routes/distanceRoutes');
app.use('/api/distance',distanceRoute);
const closestRoute = require('./routes/closestRoutes');
app.use('/api/closest',closestRoute);
const userRoute = require('./routes/userRoutes')
app.use("/api/users", userRoute);
/**Your error handler should always be at the end of 
 * your application stack. Apparently it means not only after all
 *  app.use() but also after all your app.get() and app.post() 
 * calls. */
app.use(errorHandler);
app.listen(port,()=>{console.log(`Server is runnning on port ${port}`)})

module.exports = app;