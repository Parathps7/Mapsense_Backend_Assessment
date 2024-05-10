const asyncHandler =  require('express-async-handler');
const haversine = require('haversine-distance')
const Location = require('../models/locationModel')
const {locationSchema} = require('../models/validateSchema')

const isEmpty = (array) => {
    return Array.isArray(array) && array.length === 0;
};

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function haversineDistance(coord1, coord2) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(coord2.latitude - coord1.latitude);
    const dLon = degreesToRadians(coord2.longitude - coord1.longitude);

    const lat1 = degreesToRadians(coord1.latitude);
    const lat2 = degreesToRadians(coord2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c; // Distance in kilometers
    return distance;
}

const getClosest = asyncHandler( async(req,res)=>{
    try{
        const result = await locationSchema.validateAsync(req.body);
        
        const locations = await  Location.find({ user_id: req.user.id }).select('latitude longitude -_id');

        if( isEmpty(locations) ){
            res.status(404).send({status:false,"message":"No Locations Found"});
        }
        let closestLocation;
        let closestDistance = Infinity;

        locations.forEach(location => {
        
            const distance = haversineDistance(
                { latitude: result.latitude, longitude: result.longitude },
                { latitude: location.latitude, longitude: location.longitude }
            );
        console.log(location,result,distance)
        if (distance < closestDistance) {
            closestDistance = distance;
            closestLocation = location;
        }
        });
        res.status(200).json({
            "Message":"Found The Closest Location",
            "Closest Distance in Meters": closestDistance,
            "Location": closestLocation
        });
    }
    catch(error)
    {
        res.status(400).send({success:false,"message":error.details});
    }
});

module.exports = {getClosest}