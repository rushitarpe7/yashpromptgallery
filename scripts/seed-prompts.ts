import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/prompt-gallery";

const samplePrompts = [
  {
    title: "Ethereal Cyberpunk Geisha",
    promptText:
      "Futuristic cyberpunk geisha, translucent holographic kimono glowing with neon kanji, intricate cybernetic facial implants, rain-slicked neo-Tokyo alleyway, hyper-detailed reflections, cinematic 8k, volumetric soft lighting, Octane render.",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    category: "Cyberpunk",
    tags: ["cyberpunk", "futuristic", "neon", "portrait"],
  },
  {
    title: "Floating Botanical Castle",
    promptText:
      "Studio Ghibli inspired floating island castle overgrown with bioluminescent cherry blossoms, waterfalls cascading into clouds, golden hour sunlight breaking through mist, whimsical fantasy landscape, vibrant warm pastels, trending on Artstation.",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    category: "Fantasy",
    tags: ["fantasy", "ghibli", "castle", "clouds"],
  },
  {
    title: "Pastel Dreamscape Ocean",
    promptText:
      "Minimalist surreal ocean with crystalline glass waves, oversized floating pastel coral sculptures, soft cotton candy sunset sky in lavender and coral pink, tranquil atmosphere, 3D claymation aesthetic, isometric view, ultra high definition.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    category: "Surrealism",
    tags: ["surreal", "pastel", "ocean", "minimalist"],
  },
  {
    title: "Retro 80s Synthwave Highway",
    promptText:
      "Vintage sports car driving towards a giant digital wireframe sun on an infinite grid highway, synthwave retrowave style, cyan and magenta lasers, palm trees silhouette, VHS grain texture, retro 1984 aesthetic, Outrun vibe.",
    imageUrl:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
    category: "Retro",
    tags: ["synthwave", "retro", "neon", "car"],
  },
  {
    title: "Hyper-Realistic Glass Terrarium",
    promptText:
      "Macro photography of a tiny magical universe inside an antique glass lightbulb, glowing miniature mushrooms, fireflies, mossy ancient stone ruins, dew drops refracting twilight starlight, depth of field f/1.8, National Geographic style.",
    imageUrl:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    category: "Macro",
    tags: ["macro", "nature", "magical", "glowing"],
  },
  {
    title: "Abstract Bauhaus Geometric Fluidity",
    promptText:
      "Dynamic Bauhaus composition with vibrant geometric shapes, fluid coral ribbons intersecting teal architectural arches, clean Swiss typography poster style, grainy paper texture, award-winning graphic design, Midjourney v6.",
    imageUrl:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    category: "Abstract",
    tags: ["abstract", "bauhaus", "geometric", "minimal"],
  },
];

async function seedPrompts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" Connected to MongoDB");

    const PromptSchema = new mongoose.Schema(
      {
        title: String,
        promptText: { type: String, required: true },
        imageUrl: { type: String, required: true },
        category: String,
        tags: [String],
      },
      { timestamps: true }
    );

    const PromptModel =
      mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);

    const count = await PromptModel.countDocuments();
    if (count === 0) {
      await PromptModel.insertMany(samplePrompts);
      console.log(` Successfully seeded ${samplePrompts.length} prompt cards!`);
    } else {
      console.log(` Database already contains ${count} prompts. Skipping seed.`);
    }
  } catch (error) {
    console.error(" Error seeding prompts:", error);
  } finally {
    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB");
  }
}

seedPrompts();
