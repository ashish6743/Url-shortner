// require('dotenv').config()
// const mongoose = require('mongoose')
// const Url = require('./models/Url')

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected'))
//   .catch(err => console.log(err));

// const abc = async () => {
//     const a = await new Url({originalUrl: 'https://google.com', shortCode: test123}).save()
// }

// require('dotenv').config();
// const mongoose = require('mongoose');
// const Url = require('./models/Url');

// async function run() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected');

//     const doc = await new Url({
//       originalUrl: 'https://google.com',
//       shortCode: 'test456',
//     }).save();

//     console.log('Saved:', doc);
//   } catch (err) {
//     if (err.code === 11000) {
//       console.log('Duplicate key error: shortCode already exists');
//     } else {
//       console.log('Error:', err);
//     }
//   } finally {
//     await mongoose.connection.close();
//     console.log('Connection closed');
//   }
// }

// run();