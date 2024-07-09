const os = require('os');
const pidusage = require('pidusage');

exports.getMetrics = async (req, res) => {
    const cpuUsage = os.loadavg();
    const totalMemory = os.totalmem() / (1024 ** 3); 
    const freeMemory = os.freemem() / (1024 ** 3); 
    const usedMemory = totalMemory - freeMemory;

    try {
        const stats = await pidusage(process.pid);
        const cpuUsagePercentage = stats.cpu.toFixed(2);

        res.json({
            cpuUsage: cpuUsagePercentage, 
            totalMemory: totalMemory.toFixed(2), 
            usedMemory: usedMemory.toFixed(2),
            freeMemory: freeMemory.toFixed(2) 
        });
    } catch (err) {
        console.error('Error fetching CPU usage:', err);
        res.status(500).json({ error: 'Error fetching CPU usage' });
    }
};