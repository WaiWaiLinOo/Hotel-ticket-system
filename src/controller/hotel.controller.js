const { getAll } = require('../db/hotel');

exports.getAllController = async (req, res) => {
    try {
        const data = await getAll();
        res.json(data);
    } catch (error) {
        console.error('Error in testController:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};