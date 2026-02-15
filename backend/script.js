require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User"); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI; 
// put your mongodb+srv string inside .env as MONGO_URI

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected ✅");

    const users = [];

    for (let i = 19; i <= 27; i++) {
      users.push({
        name: `Test User ${i}`,
        email: `test${i}@example.com`,
        password: await bcrypt.hash("123456", 10),
        role: "VOTER",
      });
    }

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
        console.log(`${user.email} created`);
      } else {
        console.log(`${user.email} already exists`);
      }
    }

    console.log("Seeding completed 🚀");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
