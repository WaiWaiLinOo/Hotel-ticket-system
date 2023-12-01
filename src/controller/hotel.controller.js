const { getAll } = require('../db/hotel');
const response = require('../config/response')

exports.getAllController = async (req, res) => {
    try {
        const data = await getAll();
        res.json(response{
            success: true,
            message: "Success!",
            payload: data
        }));
    } catch (error) {
        console.error('Error in testController:', error);
        res.status(500).json({ success: false, message: error });
    }
};