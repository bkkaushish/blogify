
const jwt= require("jsonwebtoken");
const secret= "@@@mahakal108";

function createToken(user){
    return jwt.sign({
        _id: user._id,
        Email: user.Email,
        Role: user.Role,
        profileImage: user.profileImage,
    },secret);
}

function verifyToken(token){
return jwt.verify(token,secret);
}

module.exports={
    createToken,
    verifyToken,
};