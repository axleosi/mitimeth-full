import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: 'osi@example.com' });
    if (existing) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const admin = new User({
      name: 'Super Admin',
      email: 'osi@example.com',
      password: 'osi123', // Consider hashing this or using a hashed value directly
      role: 'admin',
    });

    await admin.save();
    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

run();
