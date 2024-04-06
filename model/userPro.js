const mongoose= require("mongoose");
const { createHmac,randomBytes} = require('crypto');//for hashing;;
const { createToken } = require("../services/Auth");
//randomBytes for generate random secret code(secret-- which is used for hashing ie mixing with password);
const userSchema= new mongoose.Schema({

    FullName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Salt:{//required for password; to hash it;
        type: String,
    },
    Password: {
        type: String,
        required: true,
    },
    Role:{
      type: String,
      enum: ["USER","ADMIN"],//instead of these ,,throw err
      default:"USER",
    },
    profileImageUrl:{
        type: String,
        default:"/images/default.webp",
    },

},{timestamps: true});

//for password hashing-------
    // we do before saving into db;

    userSchema.pre("save",function(next){//we use normal function insteaded to =>
        const user=this;
  
        if(!user.isModified("Password"))return;
  
        //now hashing using crypto;
           //1# make salt : mixed with password;
           const Salt = randomBytes(16).toString();
           //2# make hash
           const hashedpassword= createHmac('sha256',Salt)
           .update(user.Password)//which one u want to hash
           .digest("hex");//sha256 =algorithm--,, converted to hex,
   
  
           //update object; ie. enter to db; with model Salt,password;
           this.Salt =Salt;
           this.Password= hashedpassword;
       next();//to handle upcoming function ;
      });

      //for matching password we made vertual function; 
      userSchema.static("MatchPasswordAndCreateToken",async function(Email,Password){
      const user=  await this.findOne({Email});//find Email
      if(!user) throw new Error("user not found");//not found

      const Salt= user.Salt;//Salt is equal to db Salt;
      const hashedpassword= user.Password;//hashedpassword is equal to password in db;


      //password given on signin form, we hash it and expect that it will be the same password hash as on signup;
      const userProvidedHash=createHmac('sha256',Salt)
      .update(Password)//which one u want to hash
      .digest("hex");//sha256 =algorithm--,, converted to hex,
      
      if(hashedpassword!==userProvidedHash)throw new Error("Incorrect password"); //check hashes;

     //instead of this , we use to send token;
     // return user;//return it further;
        const token= createToken(user);//token -- created from user data;
        return token;
      });
const user= mongoose.model("user",userSchema);






module.exports= user;