const authJWT = require('../middleware/authJWT');
const controller = require("../controllers/booking.controller");

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });
    
    app.get(
        "/api/bookings",
        [authJWT.verifyToken, authJWT.isSysadmin],
        controller.getAll
    );
    
    app.get(
        "/api/bookings/:restaurant",
        [authJWT.verifyToken, authJWT.isRestaurant],
        controller.getAllForRestaurant
    );
    
    app.post(
        "/api/bookings/add",
        [authJWT.verifyToken, authJWT.isSysadmin],
        controller.insertBooking
    );
    
    app.delete(
        "/api/bookings/delete/batch",
        [authJWT.verifyToken, authJWT.isSysadmin],
        controller.deleteBookings
    );
    
    app.put(
        "/api/bookings/update/:id",
        [authJWT.verifyToken, authJWT.isSysadmin],
        controller.updateBooking
    );
}