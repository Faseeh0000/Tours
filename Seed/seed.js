import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/usermodel.js";
import { Tour } from "../models/tourModel.js";
import { Booking } from "../models/booking.js";
import { Review } from "../models/riviewmodel.js";
import connectDB from "../connections/dbConnections.js";

dotenv.config({ path: "./config.env" });

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Tour.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log("Existing data cleared");

    // Create Users
    console.log("Creating users...");
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@tours.com",
        phoneNo: 1234567890,
        countryCode: "+1",
        countryISO: "US",
        pass: "admin123",
        confirmPass: "admin123",
        role: "admin",
        isVerified: true
      },
      {
        name: "Guide John",
        email: "guide@tours.com",
        phoneNo: 9876543210,
        countryCode: "+1",
        countryISO: "US",
        pass: "guide123",
        confirmPass: "guide123",
        role: "Guide",
        isVerified: true
      },
      {
        name: "Regular User",
        email: "user@tours.com",
        phoneNo: 5555555555,
        countryCode: "+92",
        countryISO: "PK",
        pass: "user123",
        confirmPass: "user123",
        role: "user",
        isVerified: true
      }
    ]);
    console.log(`✓ Created ${users.length} users`);

    // Create Tours
    console.log("Creating tours...");
    const tours = await Tour.create([
      {
        name: "Hunza Valley",
        price: 500,
        ratingsAverage: 4.5,
        duration: 5,
        difficulty: "medium",
        locations: [
          {
            type: "Point",
            coordinates: [74.6500, 36.3167],
            description: "Hunza Valley Viewpoint",
            day: 1
          },
          {
            type: "Point",
            coordinates: [74.7000, 36.3500],
            description: "Altit Fort",
            day: 2
          }
        ]
      },
      {
        name: "Swat Valley",
        price: 350,
        ratingsAverage: 4.2,
        duration: 3,
        difficulty: "easy",
        locations: [
          {
            type: "Point",
            coordinates: [72.3500, 35.2000],
            description: "Malam Jabba",
            day: 1
          },
          {
            type: "Point",
            coordinates: [72.4000, 35.2500],
            description: "Kalam Valley",
            day: 2
          }
        ]
      },
      {
        name: "Skardu Adventure",
        price: 800,
        ratingsAverage: 4.8,
        duration: 7,
        difficulty: "difficult",
        locations: [
          {
            type: "Point",
            coordinates: [75.6333, 35.3000],
            description: "Shangrila Resort",
            day: 1
          },
          {
            type: "Point",
            coordinates: [75.7000, 35.3500],
            description: "Deosai Plains",
            day: 3
          },
          {
            type: "Point",
            coordinates: [75.7500, 35.4000],
            description: "K2 Base Camp",
            day: 5
          }
        ]
      }
    ]);
    console.log(`✓ Created ${tours.length} tours`);

    // Create Bookings
    console.log("Creating bookings...");
    const bookings = await Booking.create([
      {
        tour: tours[0]._id,
        user: users[2]._id, // Regular user
        price: 500,
        paid: true
      },
      {
        tour: tours[1]._id,
        user: users[2]._id, // Regular user
        price: 350,
        paid: true
      },
      {
        tour: tours[2]._id,
        user: users[2]._id, // Regular user
        price: 800,
        paid: false
      }
    ]);
    console.log(`✓ Created ${bookings.length} bookings`);

    // Create Reviews
    console.log("Creating reviews...");
    const reviews = await Review.create([
      {
        review: "Amazing experience! The Hunza Valley tour was breathtaking. Highly recommended!",
        rating: 5,
        user: users[2]._id, // Regular user
        tour: tours[0]._id // Hunza Valley
      },
      {
        review: "Beautiful scenery in Swat Valley. The guide was very knowledgeable.",
        rating: 4,
        user: users[2]._id, // Regular user
        tour: tours[1]._id // Swat Valley
      },
      {
        review: "Challenging but rewarding! The Skardu adventure was unforgettable.",
        rating: 5,
        user: users[2]._id, // Regular user
        tour: tours[2]._id // Skardu Adventure
      }
    ]);
    console.log(`✓ Created ${reviews.length} reviews`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Tours: ${tours.length}`);
    console.log(`   - Bookings: ${bookings.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log("\n🔑 Test Credentials:");
    console.log("   Admin: admin@tours.com / admin123");
    console.log("   Guide: guide@tours.com / guide123");
    console.log("   User: user@tours.com / user123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
