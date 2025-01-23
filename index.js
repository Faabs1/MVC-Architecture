const express = require('express');

const app = express();

const env = require('dotenv').config();
const port = process.env.PORT || 3000;
const DB = require('./DATABASE/db');

const userRouter = require('./Routes/userRouter');
const AdminRouter = require('./Routes/adminRouter');
const fs = require('fs');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');


app.use(express.json());
app.use(morgan('dev'));

app.use(helmet()); // Helmet helps secure Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

app.use('/api/v1/users', userRouter); // Mount user routes at /api/v1/users
app.use('/api/v1/admin', AdminRouter); // Mount admin routes at /api/v1/admin



// Connect to the MongoDB database
DB();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

const options = {
    key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
};

app.get('/', (req, res) => {
    res.send('Welcome to this homepage!');
});

const server = https.createServer(options, app);


server.listen(port, () => {
    console.log(`server is running at https://localhost:${port}`);

})

// creating seeding data
