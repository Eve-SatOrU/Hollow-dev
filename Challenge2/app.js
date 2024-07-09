const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const connectTodb = require('./util/database');
const fs = require('fs');
const multer = require('multer');
const fileRoutes = require('./routes/fileRoute'); // Ensure fileRoute is properly defined
dotenv.config();
const PORT = 5000;
const errorHandler = require('./middlewares/validation');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'upload');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});

// Multer instance with configuration
const uploadMiddleware = multer({ storage: storage });

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(errorHandler);

app.use('/files', express.static(uploadDir)); // Serve uploaded files statically
app.use('/files', fileRoutes); // Mount file routes

// Example route handling for file operations
const { getFiles, getFileByID, uploadFile, updateFileInfoByID, deleteFileByID } = require('./controllers/fileController');

app.get('/api/files', getFiles);
app.get('/api/files/:id', getFileByID);
app.post('/api/upload', uploadMiddleware.single('file'), uploadFile);
app.patch('/api/files/:id', updateFileInfoByID);
app.delete('/api/files/:id', deleteFileByID);




// Connect to database and start server
async function startServer() {
    try {
        await connectTodb(process.env.database_url);
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Couldn't connect to the server:", error.message);
    }
}

startServer();
