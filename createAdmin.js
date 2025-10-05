const mongoose = require('mongoose');
const User = require('./models/User');
const readline = require('readline');
require('dotenv').config({ path: './config.env' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB\n');

    // Check if any admin user exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('⚠️  An admin user already exists.');
      const proceed = await question('Do you want to create another admin user? (yes/no): ');
      if (proceed.toLowerCase() !== 'yes' && proceed.toLowerCase() !== 'y') {
        console.log('Exiting...');
        rl.close();
        await mongoose.disconnect();
        return;
      }
    }

    console.log('\n=== Create Admin User ===\n');

    const username = await question('Enter username: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password (min 6 characters): ');

    // Validate inputs
    if (!username || username.length < 3) {
      console.log('❌ Username must be at least 3 characters long.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    if (!email || !email.includes('@')) {
      console.log('❌ Please enter a valid email address.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters long.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      console.log('❌ Username or email already exists.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const adminUser = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log(`\nUsername: ${username}`);
    console.log(`Email: ${email}`);
    console.log('\nYou can now login with these credentials.');
    console.log('Start the server with: npm start');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

createAdmin();
