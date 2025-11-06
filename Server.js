const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
    


const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://tammineni251_db_user:Durga863ta@cluster0.cjsamv5.mongodb.net/localjobfinder?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas connected successfully!'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Sample route
app.get('/', (req, res) => {
  res.send('Backend running successfully 🚀');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
