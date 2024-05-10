const asyncHandler =  require('express-async-handler');
const Location = require('../models/locationModel');
const {locationSchema} = require('../models/validateSchema')

const createLocation = asyncHandler( async(req,res)=>{
    try{
        const result = await locationSchema.validateAsync(req.body);
        const user_id = req.user.id;
        const exists = await Location.findOne({latitude: result.latitude,  longitude: result.longitude, user_id: user_id });
        if(exists){
            res.status(403).send({success:false,"message":"Location already added to Database."})
        }
        
        const location = await Location.create({
            user_id: user_id,
            latitude: result.latitude, 
            longitude: result.longitude
        });
        res.status(201).json({
            "Message":"SAVED!",
            "Location": location
        });
    }
    catch(error)
    {
        res.status(400).send({success:false,"message": error.message})
    }
});

const viewLocation = asyncHandler( async (req,res) => {
    const userLocations = await Location.find({ user_id: req.user.id }).select('latitude longitude');
    if( !userLocations )
        {
            res.status(400).send({success:false,"message":"No locations found!"});
        }
    res.status(200).send({success:true,"locations":userLocations});
});

const deleteLocation = asyncHandler( async(req,res) => {
    try{
    const todelete = await Location.findById(req.params.id);
    if(!todelete ){
        console.log(todelete)
        res.status(404).send({success:false,"message":"_id not found"})
    }
    if( todelete.user_id != req.user.id )
        {
            res.status(400).send({success:false,"message":"You ain't authorized to do so"})
        }
    if(todelete._id.toString() !== req.params.id){
        res.status(404).send({success:false,"message":"ID not found!!!"})
    }
    await todelete.deleteOne({_id: req.params.id});
    res.status(200).json({message:`This Image with id=${req.params.id} is Deleted`, Stock: todelete});
}
catch(error)
{
    res.status(400).send({success:false,"message":error.details});
}
})

module.exports = {createLocation,viewLocation,deleteLocation}