import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
const p = new PrismaClient();
async function main() {
  const password = await bcrypt.hash("Password123!", 12);
  await p.user.upsert({
    where: { email: "admin@booknest.dev" },
    update: {},
    create: {
      name: "BookNest Admin",
      email: "admin@booknest.dev",
      password,
      role: Role.ADMIN,
    },
  });
  await p.user.upsert({
    where: { email: "reader@booknest.dev" },
    update: {},
    create: { name: "Sample Reader", email: "reader@booknest.dev", password },
  });
  const names = [
    "Fiction",
    "Science Fiction",
    "Mystery",
    "History",
    "Technology",
  ];
  const categories: any = {};
  for (const name of names)
    categories[name] = await p.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `A curated ${name.toLowerCase()} collection.`,
      },
    });
  const books = [
    ["The Silent Garden", "Mira Cole", "Fiction"],
    ["The Glass Shore", "Anna Bell", "Fiction"],
    ["Orbit of Ash", "J. K. Rowan", "Science Fiction"],
    ["Signal at Dusk", "Emery Stone", "Science Fiction"],
    ["The Last Clue", "Ravi Shah", "Mystery"],
    ["Paper Alibi", "Lena Voss", "Mystery"],
    ["Empire of Ink", "David Noor", "History"],
    ["The Silk Road", "Nadia Khan", "History"],
    ["Clean Codecraft", "Mason Lee", "Technology"],
    ["Practical TypeScript", "Ira Benson", "Technology"],
    ["The Moon Library", "Sofia Reed", "Fiction"],
    ["Red Planet Hotel", "Colin Drake", "Science Fiction"],
    ["The Hidden Room", "Priya Sen", "Mystery"],
    ["A Brief World", "Tom Ellis", "History"],
    ["Web Patterns", "Uma Patel", "Technology"],
  ];
  for (let i = 0; i < books.length; i++) {
    const [title, author, cat] = books[i];
    await p.book.upsert({
      where: { isbn: `9780000000${String(i).padStart(3, "0")}` },
      update: {},
      create: {
        title,
        author,
        description: `${title} is a thoughtful, engaging read for every book lover.`,
        isbn: `9780000000${String(i).padStart(3, "0")}`,
        price: 12.99 + i * 2.5,
        imageUrl: `https://images.unsplash.com/photo-${i % 2 ? "1512820790803-83ca734da794" : "1544947950-fa07a98d237f"}?auto=format&fit=crop&w=600&q=80`,
        stock: 8 + i * 3,
        rating: 3.8 + (i % 6) / 5,
        categoryId: categories[cat].id,
      },
    });
  }
}
main().finally(() => p.$disconnect());
