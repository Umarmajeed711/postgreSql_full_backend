import express from "express";
import cors from "cors";
import { db } from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid"; // for generating unique token
import nodemailer from "nodemailer";
import path from "path";
import multer from "multer";
import { storage } from "./cloudinary.js";


const app = express();
const port = 5002;
const Secret = process.env.WEB_TOKEN;

app.use(
  // cors()
  cors({
    origin: "http://localhost:3000",// Your React app URL
    credentials: true,
  
  })
);
app.use(express.json());
app.use(cookieParser());



app.get("/", async (req, res) => {
  try {
    let result = await db.query("SELECT * FROM users");
    res.status(200).send({ message: "User found", data: result.rows });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/sign-up", async (req, res) => {
  let reqBody = req.body;

  let verifyToken = uuidv4(); // generate token

  if (!reqBody.name || !reqBody.email || !reqBody.password) {
    res.status(400).send({ message: "Required parameters missing" });
    return;
  }

  reqBody.email = reqBody.email.toLowerCase();

  let query = `SELECT * FROM users WHERE email = $1`;
  let values = [reqBody.email];

  try {
    let result = await db.query(query, values);

    if (result?.rows.length) {
      res.status(400).send({ message: "User already exits with this email" });
      return;
    }

    let addQuery = `INSERT INTO users (name, email, password, verify_token) VALUES ($1, $2 ,$3,$4)`;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(reqBody.password, salt);
    // Store hash in your password DB

    let addValues = [reqBody.name, reqBody.email, hash, verifyToken];

    let addUser = await db.query(addQuery, addValues);

    // // Send email
    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // let mailOptions = {
    //   from: '"Test Project" <umarmajeed711@gmail.com>',
    //   to: reqBody.email,
    //   subject: "Verify Your Email",
    //   html: `<h1>Email Verification</h1>
    //      <p>Click the link below to verify your email:</p>
    //      <a href="http://localhost:5002/verify-email?token=${verifyToken}">Verify Email</a>`,
    // };

    // await transporter.sendMail(mailOptions);
    res.status(201).send({ message: "User Created" });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Internel server error" });
  }
});



app.post("/api/v1/login", async (req, res) => {
  let reqBody = req.body;

  if (!reqBody.email || !reqBody.password) {
    res.status(400).send({ message: "Required parameters missing" });
    return;
  }

  reqBody.email = reqBody.email.toLowerCase();

  let query = `SELECT * FROM users WHERE email = $1`;
  let values = [reqBody.email];

  try {
    let result = await db.query(query, values);

    if (!result.rows.length) {
      res.status(400).send({ message: "User Doesn't exist with this Email" });
      return;
    }

    let isMatched = bcrypt.compareSync(
      reqBody.password,
      result.rows[0].password
    );

    if (!isMatched) {
      res.status(401).send({ message: "Password did not Matched" });
      return;
    }

    let token = jwt.sign(
      {
        id: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        user_role: result.rows[0].user_role,
        iat: Date.now() / 1000,
        exp: (Date.now() / 1000) + (60*60*24)
      },
      Secret
      // { expiresIn: "1d" }
    );

    res.cookie("Token", token, {
      ////////Token Name , payload Name
      maxAge: 86400000, // Define time in milliseonds  = 1 day
      httpOnly: true,
      secure: true,
    });

    res.status(200).send({
      message: "User Logged in",
      user: {
        user_id: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        user_role: result.rows[0].user_role,
        profile: result.rows[0].profile,
        create_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at,
        email_verified: result.rows[0].email_verified,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Internel Server Error" });
  }
});

app.get('/api/v1/logout', async (req, res) => {

  try{
  await res.cookie('Token', ' ', {
        maxAge: 1,
        httpOnly: true,
        // sameSite: "none",
        secure: true
    });

  res.status(200).send({message:"logout successfully"})

    
  }
  catch(error){
    console.log(error);
    
  }
  
})

// middle ware check user login or not
app.use('/api/v1/*splat' ,async (req, res, next) => {
  

 
    
    
    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "Unauthorized mmm"
            

            
        })
        return;
    }

    jwt.verify(req?.cookies.Token, Secret, (err, decodedData) => {
        if (!err) {

           

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true,
                    // sameSite: "none",
                    secure: true
                });
                res.send({ message: "token expired" })

            } else {

                console.log("token approved");
              
                

                // req.body.token = decodedData

                  req.body = {
                    ...req.body,
                    token: decodedData
                }

                
                next();
            }
        } else {
            res.status(401).send({message: "invalid token"})
        }
    });
})



// get user details

app.get('/api/v1/user-detail' , async(req, res) => {
    let userToken = req.body.token;

    
   
    
    let query = `SELECT * FROM users WHERE user_id = $1`;
    let value = [userToken.id]
    try {
        let result = await db.query(query, value)
        res.status(200).send({message: "User Found" , user: {
        user_id: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        user_role: result.rows[0].user_role,
        profile: result.rows[0].profile,
        create_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at,
        email_verified: result.rows[0].email_verified,
        }})
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({message: "Internal Server Error",error})
    }
})



// get products

// const upload = multer({storage:storage})

// app.post("/api/v1/upload", upload.single("images") , async (req,res) =>{

  
  

//   //  upload.single("images") // for single image
//   // req.file.path // for single image
//   try{

//     let response = await req.file.path

//     // response.map((eachImage,i) => {
//     //   console.log(eachImage.path);
      

//     // })

    
//     res.status(201).send({message:"Image upload", image_url : response})
     

//   }catch(error){
//     console.log(error);
//     res.status(500).send({message:"Internal server error", error})
    
//   }


// })

app.get("/api/v1/products", async (req, res) => {
  try {
    let products = await db.query(`  SELECT p.product_id, p.name, p.price, p.image_url, p.description, p.created_at, c.category_name 
        FROM products AS p 
        INNER JOIN categories c ON p.category_id = c.category_id`);
  

    //  p.product_id,p.name, c.category_name  FROM products AS p  INNER Join categories AS c On p.category_id = c.category_id

    //  ,description,price,quantity,category_name,image_url,discount,is_available, created_at,updated_at
    res
      .status(200)
      .send({ message: "Products Found", products: products.rows });
  } catch (error) {
    res.status(500).send({ message: "Internel server error", error: error });
    console.log(error);
  }
});

// get categories

app.get("/api/v1/categories", async (req, res) => {
  try {
    let category = await db.query("SELECT * FROM categories");

    res
      .status(200)
      .send({ message: "categories Found", categories: category.rows });
  } catch (error) {
    res.status(500).send({ message: "Internel server error" });
  }
});



// app.use('/api/v1/*splat' , (req, res, next) => {
//     if (req.body.token.user_role != 1) {
//         res.status(401).send({
//             message: "Unauthorized"
//         })
//         return;
//     }else{
//         next();
//     }
//})

//  Add product api
const upload = multer({storage:storage})
app.post("/api/v1/products",upload.single("image"), async (req, res) => {

  //  const imageUrl = req.file.path;
  //  const urls = req.files.map(file => file.path);

  const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // ✅ Get the Cloudinary URL automatically
    const imageUrl = file.path;


    // for uploading multiple images at a time first alter the table

    // ALTER TABLE products ADD COLUMN image_urls TEXT[];


    // and then apply this changes

    // upload.array("images", 5)

    // if (!files || files.length === 0) {
    //   return res.status(400).json({ message: "At least one image is required" });
    // }

    // // ✅ Get Cloudinary URLs
    // const imageUrls = files.map((file) => file.path);




  let { name, description, price, quantity, category_id, discount } =
    req.body;

  if (
    !name ||
    !description ||
    !price ||
    !quantity ||
    !category_id 
  ) {
    res.status(400).send({ message: "Required Parameter Missing" });
    return;
  }

  name = name.toLowerCase();

  let query = "SELECT * FROM products WHERE name = $1";
  let value = [name];

  try {
    let result = await db.query(query, value);

    // if(result){
    //   res.status(400).send("This product already Exits")
    //   return
    // }

    let add_query = `INSERT INTO products (name,description,price,quantity,category_id,image_url,discount) VALUES ($1,$2,$3,$4,$5,$6,$7)`;

    let values = [
      name,
      description,
      price,
      quantity,
      category_id,
      imageUrl,
      discount,
    ];

    let addProduct = await db.query(add_query, values);

    res.status(201).send({ message: "add product!" });
  } catch (error) {
    res.status(500).send({ message: "Internel server error", error: error });
    console.log(error);
  }
});



//  Add category api
app.post("/api/v1/category", async (req, res) => {
  let { category_name, category_description } = req.body;

  if ((!category_name, !category_description)) {
    res.status(400).send({ message: "Required Parameter Missing" });
    return;
  }

  category_name = category_name.toLowerCase();

  let query = "SELECT * FROM categories WHERE category_name = $1";
  let value = [category_name];

  try {
    let result = await db.query(query, value);

    if (result.rows.length) {
      res.status(400).send("This category already Exits");
      return;
    }

    let add_query = `INSERT INTO categories (category_name,category_description) VALUES ($1,$2)`;

    let values = [category_name, category_description];

    let addCategory = await db.query(add_query, values);

    res.status(201).send({ message: "add category!" });
  } catch (error) {
    res.status(500).send({ message: "Internel server error" });
    console.log(error);
  }
});

const __dirname = path.resolve(); // import the path first I:\Backend\Node.js\Full-Ecommerce\web-frontened
const fileLocation = path.join(__dirname, "./web-frontened/build");
app.use("/", express.static(fileLocation));
app.use("/*splat", express.static(fileLocation));

app.listen(port, () => {
  console.log("Project is running on port: ", port);
});
