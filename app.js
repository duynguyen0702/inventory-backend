const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config();
connectDB();

const app = express();

// ✅ Cấu hình CORS chính xác
const allowedOrigins = [
  'http://localhost:3000',
  'https://inventory-frontend-umber.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Các route API
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/import-orders', require('./routes/importOrderRoutes'));
app.use('/api/export-orders', require('./routes/exportOrderRoutes'));
app.use('/api/prices', require('./routes/priceRoutes'));

// ✅ Nếu cần test route gốc
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Dùng biến môi trường PORT nếu có (Render sẽ gán tự động)
const PORT = process.env.PORT || 3567;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
