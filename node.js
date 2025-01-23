const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/uploadedFiles', { useNewUrlParser: true, useUnifiedTopology: true });

const fileSchema = new mongoose.Schema({
    filename: String,
    filepath: String
});
const File = mongoose.model('File', fileSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

app.post('/upload', upload.single('file'), (req, res) => {
    const newFile = new File({
        filename: req.file.originalname,
        filepath: req.file.path
    });

    newFile.save()
        .then(() => res.status(200).json({ message: 'File uploaded successfully!' }))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.get('/files', (req, res) => {
    File.find()
        .then(files => res.status(200).json(files))
        .catch(err => res.status(400).json({ error: err.message }));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
