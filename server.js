// server.js
import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize database - creates all tables
async function initDB() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        profile_picture VARCHAR(500),
        user_type VARCHAR(20) CHECK (user_type IN ('rider', 'driver', 'both')),
        is_verified BOOLEAN DEFAULT false,
        rating DECIMAL(3,2) DEFAULT 5.0,
        total_rides INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Vehicles table (for drivers)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        driver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('economy', 'comfort', 'premium')),
        license_plate VARCHAR(20) UNIQUE NOT NULL,
        model VARCHAR(100),
        color VARCHAR(50),
        capacity INT DEFAULT 4,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Rides table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rides (
        id SERIAL PRIMARY KEY,
        rider_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        driver_id INT REFERENCES users(id) ON DELETE SET NULL,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
        pickup_location VARCHAR(500) NOT NULL,
        pickup_lat DECIMAL(10,8),
        pickup_lng DECIMAL(11,8),
        dropoff_location VARCHAR(500) NOT NULL,
        dropoff_lat DECIMAL(10,8),
        dropoff_lng DECIMAL(11,8),
        ride_type VARCHAR(50) CHECK (ride_type IN ('economy', 'comfort', 'premium')),
        status VARCHAR(50) CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed', 'cancelled')),
        estimated_fare DECIMAL(10,2),
        actual_fare DECIMAL(10,2),
        distance_km DECIMAL(10,2),
        duration_minutes INT,
        scheduled_time TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Bookings table (for scheduled rides)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        ride_id INT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
        rider_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        booking_status VARCHAR(50) CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
        number_of_passengers INT DEFAULT 1,
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        ride_id INT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
        rider_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) CHECK (payment_method IN ('card', 'wallet', 'cash')),
        payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        ride_id INT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
        rater_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ratee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Driver locations (real-time tracking)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS driver_locations (
        id SERIAL PRIMARY KEY,
        driver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        is_online BOOLEAN DEFAULT true,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✓ All tables created successfully');
  } catch (err) {
    console.error('✗ DB init error:', err);
  }
}

initDB();

// Middleware: verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============ AUTH ENDPOINTS ============

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  const { fullName, email, phone, password, userType } = req.body;
  
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (full_name, email, phone, password_hash, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, phone, user_type',
      [fullName, email, phone, passwordHash, userType || 'rider']
    );
    
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        userType: user.user_type
      }
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email or phone already registered' });
    }
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, full_name, phone, user_type, password_hash FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        userType: user.user_type
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CURRENT USER
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, phone, user_type, rating, total_rides FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      userType: user.user_type,
      rating: user.rating,
      totalRides: user.total_rides
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ RIDE ENDPOINTS ============

// REQUEST A RIDE
app.post('/api/rides/request', verifyToken, async (req, res) => {
  const { pickupLocation, pickupLat, pickupLng, dropoffLocation, dropoffLat, dropoffLng, rideType, estimatedFare } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO rides (rider_id, pickup_location, pickup_lat, pickup_lng, dropoff_location, dropoff_lat, dropoff_lng, ride_type, status, estimated_fare)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, pickupLocation, pickupLat, pickupLng, dropoffLocation, dropoffLat, dropoffLng, rideType, 'requested', estimatedFare]
    );
    
    res.status(201).json({ success: true, ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET AVAILABLE DRIVERS (nearby)
app.get('/api/drivers/available', async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.rating, v.vehicle_type, v.license_plate, dl.latitude, dl.longitude
       FROM users u
       JOIN driver_locations dl ON u.id = dl.driver_id
       LEFT JOIN vehicles v ON u.id = v.driver_id
       WHERE u.user_type IN ('driver', 'both') AND dl.is_online = true
       AND (6371 * acos(cos(radians($1)) * cos(radians(dl.latitude)) * cos(radians($2) - radians(dl.longitude)) + sin(radians($1)) * sin(radians(dl.latitude)))) < $3
       ORDER BY u.rating DESC`,
      [lat, lng, radius]
    );
    
    res.json({ drivers: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ACCEPT RIDE (driver)
app.post('/api/rides/:rideId/accept', verifyToken, async (req, res) => {
  const { rideId } = req.params;
  const { vehicleId } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE rides SET driver_id = $1, vehicle_id = $2, status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [req.user.id, vehicleId, rideId]
    );
    
    res.json({ success: true, ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE RIDE STATUS
app.patch('/api/rides/:rideId/status', verifyToken, async (req, res) => {
  const { rideId } = req.params;
  const { status } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE rides SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, rideId]
    );
    
    res.json({ success: true, ride: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET RIDE HISTORY
app.get('/api/rides/history', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM rides WHERE rider_id = $1 OR driver_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    
    res.json({ rides: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PAYMENT ENDPOINTS ============

// CREATE PAYMENT
app.post('/api/payments', verifyToken, async (req, res) => {
  const { rideId, amount, paymentMethod } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO payments (ride_id, rider_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [rideId, req.user.id, amount, paymentMethod, 'completed']
    );
    
    res.status(201).json({ success: true, payment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ RATING ENDPOINTS ============

// RATE A RIDE
app.post('/api/ratings', verifyToken, async (req, res) => {
  const { rideId, rateeId, rating, review } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO ratings (ride_id, rater_id, ratee_id, rating, review)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [rideId, req.user.id, rateeId, rating, review]
    );
    
    res.status(201).json({ success: true, rating: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});