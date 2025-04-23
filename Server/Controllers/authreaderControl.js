import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { verify } = jwt;

import Reader from "../Models/ReaderModel.js";

export const register = async (req, res) => { 
    const { firstname, lastname, email, password, bookcategories } = req.body;

   
    if (!firstname || !lastname || !email || !password || !bookcategories) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }

    try {
        const userExists = await Reader.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }     

        
        const hashedPassword = await bcrypt.hash(password, 12);

        
        const reader = new Reader({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            bookcategories,
        });
        await reader.save();

       
        const token = jwt.sign( 
            { id: reader._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        

        return res.json({success:true, message: "User registered successfully" });

    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

    export const login = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        try {
            const reader = await Reader
                .findOne({ email })
               
            if (!reader) {
                return res.status(400).json({success:false, error: "email is not existed" });
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            
            if(!isPasswordMatch){
                return res.status(400).json({success:false, error:"password is incorrect"});
            }
            const token = jwt.sign(
                { id: reader._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
            
            return res.json({success:true, message: "Login successful" });
        }
        catch(error){
            console.error("Error in login:", error);
            res.status(500).json({success:false, error: "Server error" });

        }
    }
    export const logout = async (req, res) => {
        try {
        res.clearCookie("token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
        
        return res.json({success:true, message: "Logged out" });
} catch (error) {
    console.error("Error in logout:", error);
    }}

