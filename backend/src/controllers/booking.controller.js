const Bookings = require('../models/bookings');

exports.getAll = async function getAll(req, res) {
    try {
        var bookings = await Bookings.getAll();
        return res.status(200).send(bookings);
    } catch(e){
        return res.status(500).send({
            message: "Error querying for bookings."
        });
    }
}