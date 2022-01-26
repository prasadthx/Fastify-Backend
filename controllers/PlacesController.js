import Vendor from '../models/Vendor';
import Place from '../models/Place';
import Image from '../models/Image';

export const createPlace = async (req, res) => {
    let vendor = req.user;
    vendor = await Vendor.findOne({email : vendor.data.email});
    if(!vendor){
        return res.status(400).send({ error: "Invalid Token" });
    }
    let {name, categories, location} = req.body; 
    const place = new Place({name, categories, location, vendor});
    await place.save();
    return res.code(201).send({place});
}

export const updatePlace = async (req, res) => {
    let vendor = req.user;
    vendor = await Vendor.findOne({email : vendor.data.email});
    if(!vendor){
        return res.status(400).send({ error: "Invalid Token" });
    }
    let place = await Place.findOne({_id : req.params.place_id}).populate("vendor");
    if(!place || place.vendor.email !== vendor.email) {
        return res.status(400).send({ error: "Not authorized" });
    }
    let {name, categories, location} = req.body ;
    place.name = name;
    place.categories = categories;
    place.location = location;
    await place.save();
    return res.code(201).send({success : "Place updated successfully"});
}

export const deletePlace = async (req, res) => {
    let vendor = req.user;
    vendor = await Vendor.findOne({email : vendor.data.email});
    if(!vendor){
        return res.status(400).send({ error: "Invalid Token" });
    }
    let place = await Place.findOne({_id : req.params.place_id}).populate("vendor");
    if(!place || place.vendor.email !== vendor.email) {
        res.status(400).send({ error: "Not authorized" });
    }
    await place.delete();
    return res.code(200).send({success : "Place deleted successfully"});
}

export const getPlace = async (req, res) => {
    let place = await Place.findOne({_id : req.params.place_id});
    if(!place){
        return res.status(400).send({ error: "Invalid Place ID" });
    }
    return res.code(201).send({place});
}

export const getPlacesByVendor = async (req, res) => {
    let vendor = req.user;
    vendor = await Vendor.findOne({email : vendor.data.email});
    if(!vendor){
        return res.status(400).send({ error: "Invalid Token" });
    }
    let places = await Place.find({vendor : vendor._id});
    return res.code(200).send({places : places});
}

export const getPlacesWithin = async (req, res) => {
    const sorted = req.params.sorted;
    const longitude = parseFloat(req.query.longitude);
    const latitude = parseFloat(req.query.latitude);
    const radius = parseFloat(req.query.radius);

    if(!longitude || !latitude || !radius){
        return res.status(400).send({ error: "Inadequate information" });
    }

    const unSortedOptions = {
        $geoWithin:
            { 
                $centerSphere: [ [ longitude, latitude ], radius / 3963.2 ] 
            } 
    }

    const METERS_PER_MILE = 1609.34;

    const sortedOptions = { 
        $nearSphere: 
        {   $geometry: { type: "Point", coordinates: [ longitude, latitude ] }, 
            $maxDistance: radius * METERS_PER_MILE 
        } 
    } 
    
    if(sorted!==''){
        const places = await Place.find({location : sortedOptions})
        return res.code(200).send({places : places});
    }
    else{
        const places = await Place.find({location : unSortedOptions});
        return res.code(200).send({places : places});
    }
}

export const uploadPhotos = async (req, res) => {
    const vendor = await Vendor.findOne({ email: req.user.data.email });
    if(!vendor) {
        return res.status(401).send({ error: 'Invalid Token' })
    }
    let place = await Place.findOne({_id : req.params.place_id}).populate("vendor");
    if(!place || place.vendor.email !== vendor.email) {
        return res.status(400).send({ error: "Not authorized" });
    }
    let images = [];
    for (let file of req.files){
        let image = new Image({
            filename: file.filename,
            originalname: file.originalname,
            url: file.path
        });
        image = await image.save();
        images.push(image);
    }
    place.photos = images;
    place.save();
    return res.code(200).send({success : "Photos uploaded"});
}

export const getPhotos = async (req, res) => {
    const place = await Place.findOne({_id : req.params.place_id}).populate("vendor")
    if(!place) {
        return res.status(400).send({ error: "Invalid PlaceID" });
    }
    let photos = [];
    for(let photo of place.photos) {
        let image = await Image.findOne({_id:photo})
        photos.push(image);
    }
    return res.code(200).send({photos});
}