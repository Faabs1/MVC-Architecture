const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const port = process.env.PORT;
const cron = require("node-cron");
const env = require('dotenv').config();
const cloudinary = require('../utils/cloudinary');



// signup route
const Signup = async (req, res) => {
    try {
        const { userName,  password, email,confirmpassword,profilePic } = req.body;

        if(password!==confirmpassword){
            return res.status(400).json({ msg: 'Passwords do not match' });
        }
      
        const existingUser = await User.findOne({ email})

            if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });  
            }
    
            const hashPassword =await bcrypt.hash(password, 10)  //10 is the Saltround for the hashing
            //i.e the number of rounds that the password can be hashed and the standard is 10-12,

            const result = await cloudinary.uploader.upload(req.file.path);

            console.log(result);
            
    
    
            //create a new user document with the provided data using destructuring
            const User = new User({
                userName,
                password: hashPassword,
                email,
                profilePic: result.secure_url
            });
            await newUser.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.MAIL_PASS,
                },
            });

            // Define the Email options
            const mailOptions = {
                from: process.env.MAIL,
                to: `${newUser.email}`,
                subject: 'Hello from MVC Architecture',
                text: `Welcome ${newUser.userName} to our platform`,
            };

            // Send the mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occured: ' , error);

                    //write a function to send a scheduled message (every 5 min)
                    // Use Cron to schedule
                } else {
                    console.log("Email sent:", info.response);
                }
            });

                     //respond with a success message
            return res.status(200).json({message: "User saved successfully and you will recieve a mail", user});
                } catch (error) {
                    console.log(error);
                    
            return res.status(500).json({message:"internal server error"})
            
        }
}


const Login = async (req, res) => {
    try {
        const {email,password} =req.body;
        
        const user = await User.findOne({email:email});

        if(!user) {
            return res.status(400).json({msg:'User not found'})
        }
        
        const isMatch =await bcrypt.compare(password,user.password)
        
        if(!isMatch){
            return res.status(400).json({msg:'Invalid password credentials'})
        } 

        const payload = {
            id: user.id,
            password: user.password
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.status(200).json({msg:'User logged in successfully', token: token});
    } catch (error) {
        return res.status(500).json({msg:'Internal server error'})
    }
}
    

    const AllUsers = async (req, res) => {
        try {
            const user = await User.find({});
            return res.status(200).json({message: 'these are the users',user})

        } catch (error) {
            console.log(error);
            
            return res.status(500).json({msg:'Internal server error'})
        }
    }

    const forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'User not found' });
            }

            const token = await crypto.randomBytes(32).toString('hex');

            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000; // 1 hour

            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.MAIL_PASS,
                },
            });

            //Define the email options
            const mailOptions = {
                from: process.env.MAIL,
                to: `${user.email}`,
                subject: 'Password Reset from MVCArrchitecture',
    text: `Hello ${user.userName}, You are receiving this because you (or someone else) have requested the reset of the Password for your account. 
    Please click on the following link or paste this into your browser to complete the process:
    http://localhost:${port}/api/v1/users/reset/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occured: ', error);
                } else {
                    console.log("Email sent:", info.response);
                }
            });
            return res.status(200).json({ message: 'Reset token sent' });

        } catch (error) {
            console.log(error);

            return res.status(500).json({ message: 'Error occured' });
            
        }
    }


    const resetPassword = async (req, res) => {
        try {
            const token = req.params.token;
            
            const { password } = req.body;

            const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid token  or expired' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;

            await user.save();

            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' });
    }
}

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.MAIL,
//         pass: process.env.MAIL_PASS,
//     },
// });

// //FUNCTION TO SEND EMAIL TO ALL USERS IN THE DATABASE
// const sendmail = async () => {
//     try {
//         // fetch all users from the database
//         const users = await User.find();

//         // loop through the users array
//         if (users.length === 0) {
//             console.log('No recipients found');
//             return;
//         }

//         //loop through users and send emailto each 
//         for (const user of users) {
//             const mailOptions = {
//                 from: process.env.MAIL,
//                 to: user.email,
//                 subject: 'Hello from MVC Architecture',
//                 text: `Welcome ${user.userName} to our platform`,
//             };

//             await transporter.sendmail(mailOptions);
//             console.log(`Email sent to ${user.email}`);
//     }
//     } catch (error) {
//         console.error('error sending email', error);
//     }
// };

// //Schedule the cron job to run at 12pm daily
//     cron.schedule('0 0 12 * * *', () => {
//         console.log('Running Cron Job - Sending daily email');
//         sendmail();
//     });

//export the routes
    module.exports = {Signup, Login, AllUsers, forgotPassword, resetPassword};


    // async function seedData() {
    //     try {
    //         for (let i = 0; i < 400; i++) {
    //         const password  = `password${i}`
    
    //         const hashedPassword = await bcrypt.hash(password, 10);
    
    //         const user = new User({
    //             userName: `user${i}`,
    //             password: hashedPassword,
    //             email: `user${i}@yopmail.com`
    //         });
            
    //         await user.save();
    //         console.log(`seeding in progress ${user.userName}`);
    //     }
    //     console.log(`Data seeded successfully`);
    // } catch (error) {
    //     console.error('error seeding data', error);
    // }
    // }
    
    // seedData();


  

// Function to send a scheduled email
// function sendScheduledMessage() {
//   const mailOptions = {
//     from: process.env.MAIL, // Replace with your email
//     to: user.email, // Replace with recipient's email
//     subject: "Scheduled Message",
//     text: "Hello! This is your scheduled message sent every 5 minutes.",
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//     } else {
//       console.log("Email sent successfully:", info.response);
//     }
//   });
// }

// // Schedule the function to run every 5 minutes
// cron.schedule("*/1 * * * *", () => {
//   sendScheduledMessage();
//   console.log("Scheduled email sent at:", new Date().toLocaleString());
// });

// // Start the script
// console.log("Cron job initialized to send an email every 1 minutes.");
