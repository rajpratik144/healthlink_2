import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
  Verify JWT and attach user to request
*/
export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded);

        console.log("JWT Secret:", process.env.JWT_SECRET);
        console.log("Token:", token);


        const user = await User.findById(decoded.id);

        if (!user || user.isDeleted) {
            return res.status(401).json({
                success: false,
                message: "User not found or deactivated",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, invalid token",
        });
    }
};

/*
  Role-based authorization
*/
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        next();
    };
};