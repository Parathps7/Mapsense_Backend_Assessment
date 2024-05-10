const asyncHandler =  require('express-async-handler');
const haversine = require('haversine-distance')
const {dist} = require('../models/validateSchema')

//@desc get Distance of 2 coordinates
//@route POST /api/distance
//@access private
const getDistance = asyncHandler( async(req,res)=>{
    try{
        const result = await dist.validateAsync(req.body);
        
        const distance = haversine(result.coordinate1,result.coordinate2);
        res.status(200).json({
            success:true,
            "Message":"Calculated Harvesine Distance",
            "Distance in Meters": distance
        });
    }
    catch(error)
    {
        res.status(400).send({success:false,"message": error.message})
    }
});

module.exports = {getDistance}