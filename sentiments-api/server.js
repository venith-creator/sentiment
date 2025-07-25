import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve('./.env') })

console.log('🌍 ENV EMAIL_USER:', process.env.EMAIL_USER);
console.log('🌍 ENV EMAIL_PASS:', process.env.EMAIL_PASS);

const app = express()
app.use(cors())
app.use(express.json())

import authRoutes from './routes/auth.routes.js'
import contactRoutes from './routes/contact.routes.js'
import analysisRoutes from './routes/analysis.routes.js'
import feedbackRoutes from './routes/feedback.routes.js'
import workerRoutes from './routes/worker.routes.js'
import momentRoutes from './routes/moment.routes.js'
import roomRoutes from './routes/room.routes.js'
import tenantRoutes from './routes/tenants.routes.js'
import { startRoomMonitor } from './utils/scheduler.js'
import waitlistRoutes from './routes/waitlist.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/moments', momentRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')))
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes)
app.use('/api/waitlist', waitlistRoutes)


app.use((req, res, next) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});


const PORT = process.env.PORT || 8000


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
    startRoomMonitor();
  })
  .catch(err => console.error('❌ DB Connection Error:', err))
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err)
})
