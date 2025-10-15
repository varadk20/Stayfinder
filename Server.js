// -------------------- Imports --------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const ListingModel = require('./src/backend/Models/Listings');
const userModel = require('./src/backend/Models/Users');
const BookingModel = require('./src/backend/Models/Booking');
const Query = require('./src/backend/Models/Query');

// -------------------- App Setup --------------------
const app = express();
app.use(cors());
app.use(express.json());

// -------------------- MongoDB Connection --------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// -------------------- Socket.IO Setup --------------------
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: { origin: "*" } // allow all origins; restrict in production
});

io.on('connection', (socket) => {
  console.log('🧠 Socket connected:', socket.id);

  socket.on('joinListingRoom', (listingId) => socket.join(`listing_${listingId}`));
  socket.on('leaveListingRoom', (listingId) => socket.leave(`listing_${listingId}`));

  socket.on('disconnect', () => {
    // console.log('Socket disconnected:', socket.id);
  });
});

// -------------------- ROUTES --------------------

// ✅ Get all listings
app.get('/getListings', async (req, res) => {
  try {
    const listings = await ListingModel.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listings' });
  }
});

// ✅ Register new user
app.post('/getUser', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "No user found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get listing by ID
app.get('/getListingById/:id', async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    res.json(listing);
  } catch {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Add listing
app.post('/addListing', async (req, res) => {
  const { name, location, price, image, description, address, email } = req.body;
  if (!name || !location || !price || !image || !description || !address || !email)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const newListing = new ListingModel({ name, location, price, image, description, address, email });
    await newListing.save();
    res.status(201).json({ message: 'Listing added successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get listings by host email
app.get('/getUserListings/:email', async (req, res) => {
  try {
    const listings = await ListingModel.find({ email: req.params.email });
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Error fetching listings' });
  }
});

// ✅ Delete listing
app.delete('/deleteListing/:id', async (req, res) => {
  try {
    await ListingModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Error deleting listing' });
  }
});

// ✅ Update listing
app.put('/updateListing/:id', async (req, res) => {
  try {
    await ListingModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: 'Listing updated successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Book listing
app.post("/book", async (req, res) => {
  const { listingId, listingName, guestEmail, checkIn, checkOut, nights, totalPrice } = req.body;
  if (!listingId || !guestEmail || !checkIn || !checkOut)
    return res.status(400).json({ message: "Missing booking details" });

  try {
    const booking = new BookingModel({ listingId, listingName, guestEmail, checkIn, checkOut, nights, totalPrice });
    await booking.save();
    res.status(201).json({ message: "Booking confirmed!", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get reviews for a listing
app.get('/getReviews/:listingId', async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.listingId).select('reviews averageRating');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ reviews: listing.reviews, averageRating: listing.averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Add review (only if booked)
app.post('/addReview', async (req, res) => {
  const { listingId, userEmail, rating, comment } = req.body;
  if (!listingId || !userEmail || !rating)
    return res.status(400).json({ message: 'Missing required fields' });

  try {
    const hasBooking = await BookingModel.findOne({ listingId, guestEmail: userEmail });
    if (!hasBooking)
      return res.status(403).json({ message: 'You can only review after booking this hotel.' });

    const listing = await ListingModel.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const newReview = { userEmail, rating: Number(rating), comment: comment || '', createdAt: new Date() };
    listing.reviews.push(newReview);

    const total = listing.reviews.reduce((sum, r) => sum + r.rating, 0);
    listing.averageRating = total / listing.reviews.length;
    await listing.save();

    const addedReview = listing.reviews[listing.reviews.length - 1];

    io.to(`listing_${listingId}`).emit('reviewAdded', { listingId, review: addedReview, averageRating: listing.averageRating });

    res.status(201).json({ message: 'Review added', review: addedReview, averageRating: listing.averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Edit review (only author)
app.put('/editReview/:listingId/:reviewId', async (req, res) => {
  const { listingId, reviewId } = req.params;
  const { userEmail, rating, comment } = req.body;

  try {
    const listing = await ListingModel.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const review = listing.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userEmail !== userEmail) return res.status(403).json({ message: 'Not authorized' });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    review.createdAt = new Date();

    const total = listing.reviews.reduce((sum, r) => sum + r.rating, 0);
    listing.averageRating = total / listing.reviews.length;
    await listing.save();

    io.to(`listing_${listingId}`).emit('reviewUpdated', { listingId, review, averageRating: listing.averageRating });
    res.json({ message: 'Review updated', review, averageRating: listing.averageRating });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete review (only author)
app.delete('/deleteReview/:listingId/:reviewId', async (req, res) => {
  const { listingId, reviewId } = req.params;
  const { userEmail } = req.body;

  try {
    const listing = await ListingModel.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const review = listing.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userEmail !== userEmail) return res.status(403).json({ message: 'Not authorized' });

    review.deleteOne();

    if (listing.reviews.length === 0) listing.averageRating = 0;
    else listing.averageRating = listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length;

    await listing.save();

    io.to(`listing_${listingId}`).emit('reviewDeleted', { listingId, reviewId, averageRating: listing.averageRating });
    res.json({ message: 'Review deleted', averageRating: listing.averageRating });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


// Contact (Query) form route
app.post('/contact', async (req, res) => {
  try {
    const { from, to, subject, description } = req.body;

    const newQuery = new Query({ from, to, subject, description });
    await newQuery.save();

    res.status(200).json({ message: "Query submitted successfully" });
  } catch (error) {
    console.error("Error submitting query:", error);
    res.status(500).json({ error: "Failed to submit query" });
  }
});


// // Get all queries (for admin dashboard, optional)
// app.get('/getQueries', async (req, res) => {
//   try {
//     const queries = await QueryModel.find();
//     res.status(200).json(queries);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch queries' });
//   }
// });

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
//ezekiel