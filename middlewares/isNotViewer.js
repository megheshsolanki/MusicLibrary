module.exports = (req,res,next) => {
    if(req.role == "viewer"){
        return res.status(401).json({ status: 401, data: null, message: "Unauthorized Access.", error: null });
    }
    next();
}