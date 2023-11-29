const { testData } = require('../db/test');

exports.testController = async (req, res) => {
    try {
        const data = await testData();
        res.json(data);
    } catch (error) {
        console.error('Error in testController:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};