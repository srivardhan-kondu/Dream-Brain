import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// Load server/.env regardless of the process working directory.
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Question } from './models/Question.js';
import { ALL_QUESTIONS } from './data/questions.js';
import { AGE_GROUPS } from './data/catalog.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dream_brain';

async function seed() {
  await connectDB(MONGO_URI);

  await Question.deleteMany({});
  console.log('• Cleared existing questions');

  const inserted = await Question.insertMany(ALL_QUESTIONS);
  console.log(`• Inserted ${inserted.length} questions`);

  for (const group of AGE_GROUPS) {
    const n = inserted.filter((q) => q.ageGroup === group.key).length;
    console.log(`   - ${group.name} (${group.range}): ${n} questions`);
  }

  await mongoose.disconnect();
  console.log('✓ Seed complete');
}

seed().catch((err) => {
  console.error('✗ Seed failed:', err);
  process.exit(1);
});
