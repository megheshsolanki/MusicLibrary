module.exports = (req,res,next) => {
    if(req.role !== "admin"){
        return res.status(401).json({ status: 401, data: null, message: "Unauthorized Access. from rolecheck", error: null });
    }
    next();
}