const fs = require('fs');
const path = require('path');

exports.listDirectory = (req, res) => {
    let dirPath = req.query.path || '/';
    
    dirPath = path.normalize(dirPath);

    console.log('Listing directory:', dirPath);

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const fileDetails = files.map(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                path: filePath,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                lastModified: stats.mtime
            };
        });

        res.json(fileDetails);
    });
};


exports.createDirectory = (req, res) => {
    let dirPath = req.body.path;
    
    dirPath = path.normalize(dirPath);

    console.log('Creating directory:', dirPath);

    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Directory created successfully' });
    });
};

/*
List Directory:
http://localhost:3000/directory/list?path=C:/Users/AYOO INFORMATIQUE/Desktop/http-server

ceate Directory:
http://localhost:3000/directory/create
Body:
{
    "path": "C:/Users/AYOO INFORMATIQUE/Desktop/http-server/new-directory"
}
*/

// with pug
// exports.listDirectory = (req, res) => {
//     let dirPath = req.query.path || '/';

//     // Normalize the path to avoid issues
//     dirPath = path.normalize(dirPath);

//     // Debugging: Log the directory path being used
//     console.log('Listing directory:', dirPath);

//     fs.readdir(dirPath, (err, files) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }

//         const fileDetails = files.map(file => {
//             const filePath = path.join(dirPath, file);
//             let stats;
//             try {
//                 stats = fs.statSync(filePath);
//             } catch (error) {
//                 if (error.code === 'EPERM' || error.code === 'ENOENT') {
//                     // Skip files we can't access or that don't exist
//                     return null;
//                 }
//                 return res.status(500).json({ error: error.message });
//             }
//             return {
//                 name: file,
//                 path: filePath,
//                 isDirectory: stats.isDirectory(),
//                 size: stats.size,
//                 lastModified: stats.mtime
//             };
//         }).filter(file => file !== null); // Filter out null entries

//         res.render('directory-list', { files: fileDetails, path: dirPath });
//     });
// };

// exports.createDirectory = (req, res) => {
//     let dirPath = req.body.path;
    
//     // Normalize the path to avoid issues
//     dirPath = path.normalize(dirPath);

//     // Debugging: Log the directory path being created
//     console.log('Creating directory:', dirPath);

//     fs.mkdir(dirPath, { recursive: true }, (err) => {
//         if (err) {
//             return res.render('directory-list', { createError: err.message });
//         }
//         res.render('directory-list', { message: 'Directory created successfully' });
//     });
// };
