import bcrypt from "bcryptjs";
import prisma from "./utils/prisma.js";

const createAdmin = async () => {
  try {
    const password = "Admin123!";

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name: "Administrator",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });


    console.log("Admin created:", admin.email);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();