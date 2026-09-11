
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const login = async (req, res) => {
  console.log("========== LOGIN FUNCTION CALLED ==========");

  try {
    // Get data from request
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    // Check if email and password were provided
    if (!email || !password) {
      console.log("Missing email or password");

      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    console.log("EMAIL RECEIVED:", email);
    console.log("Looking for user:", email);

    // Find user in database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Check whether user exists
    console.log(
      "USER:",
      user ? "FOUND" : "NOT FOUND"
    );

    if (!user) {
      console.log("USER NOT FOUND:", email);

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // User exists
    console.log("USER FOUND:", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHashExists: !!user.password,
    });

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD MATCH:", passwordMatch);

    // Password doesn't match
    if (!passwordMatch) {
      console.log("PASSWORD IS INCORRECT");

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("PASSWORD CORRECT");

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        message: "JWT configuration error",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("JWT CREATED");
    console.log("LOGIN SUCCESSFUL");

    // Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("========== LOGIN ERROR ==========");
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

