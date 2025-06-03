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

exports.getAllForRestaurant = async function getAllForRestaurant(req, res) {
    const restaurant = req.params.restaurant;
    try {
        var bookings = await Bookings.getAllForRestaurant(restaurant);
        return res.status(200).send(bookings);
    } catch(e){
        return res.status(500).send({
            message: "Error querying for bookings."
        });
    }
}

exports.deleteBookings = async function deleteBookings(req, res) {
    const bookingIds = req.body.bookingIds;
    try {
        await Bookings.deleteByIDs(bookingIds);
        return res.status(200).send({
            message: "Bookings deleted successfully"
        });
    } catch(e){
        return res.status(500).send({
            message: "Error deleting bookings."
        });
    }
}

exports.updateBooking = async function updateBooking(req, res) {
    const bookingId = req.params.id;
    const bookingData = req.body;
    
    try {
        await Bookings.updateBooking(
            bookingId,
            bookingData.booking_date,
            bookingData.booking_hour,
            bookingData.booking_name,
            bookingData.booking_restaurant,
            bookingData.booking_guests,
            bookingData.booking_email,
            bookingData.booking_contact,
            bookingData.booking_table,
            bookingData.booking_state,
            bookingData.booking_note
        );
        return res.status(200).send({
            message: "Booking updated successfully"
        });
    } catch(e) {
        return res.status(500).send({
            message: "Error updating booking."
        });
    }
}

exports.insertBooking = async function insertBooking(req, res) {
    const booking = req.body;
    const booking_date = booking.booking_date;
    const booking_hour = booking.booking_hour;
    const booking_name = booking.booking_name;
    const booking_restaurant = booking.booking_restaurant;
    const booking_guests = booking.booking_guests;
    const booking_email = booking.booking_email;
    const booking_contact = booking.booking_contact;
    const booking_table = booking.booking_table;
    const booking_state = booking.booking_state;
    const booking_note = booking.booking_note;
    const booking_created_by = booking.booking_created_by;

    console.log("Booking Data:", booking); // Log the booking data
    
    
    try {
        var booking_id = await Bookings.insertBooking(
            booking_date,
            booking_hour,
            booking_name,
            booking_restaurant,
            booking_guests,
            booking_email,
            booking_contact,
            booking_table,
            booking_state, 
            booking_note,
            booking_created_by 
        );
        return res.status(200).send(
            {
                message: "Booking created successfully", 
                booking_id: booking_id,
            }
        );
    } catch(e){
        return res.status(500).send({
            message: "Error inserting booking."
        });
    }
}