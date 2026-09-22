import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "❌ Missing required env vars: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD"
  );
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const AdminModel =
      mongoose.models.Admin ||
      mongoose.model(
        "Admin",
        new mongoose.Schema(
          {
            email: { type: String, required: true, unique: true },
            passwordHash: { type: String, required: true },
          },
          { timestamps: true }
        )
      );

    const existing = await AdminModel.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`⚠️  Admin with email "${ADMIN_EMAIL}" already exists. Updating password...`);
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await AdminModel.updateOne({ email: ADMIN_EMAIL }, { passwordHash: hash });
      console.log("✅ Password updated.");
    } else {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await AdminModel.create({
        email: ADMIN_EMAIL,
        passwordHash: hash,
      });
      console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
}

seedAdmin();
