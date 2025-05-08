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