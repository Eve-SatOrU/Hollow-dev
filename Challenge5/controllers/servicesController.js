const { exec } = require('child_process');
// for windows
exports.listServices = (req, res) => {
    exec('Get-Service', { shell: 'powershell.exe' }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ services: stdout });
    });
};

exports.startService = (req, res) => {
    const serviceName = req.body.serviceName;
    exec(`sudo systemctl start ${serviceName}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ message: `${serviceName} started successfully` });
    });
};

exports.stopService = (req, res) => {
    const serviceName = req.body.serviceName;
    exec(`sudo systemctl stop ${serviceName}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ message: `${serviceName} stopped successfully` });
    });
};