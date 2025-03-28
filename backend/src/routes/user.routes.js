const authJWT = require('../middleware/authJWT');
const controller = require("../controllers/user.controller");


module.exports = (app) => {
    app.use( (req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    });
    
    app.get("/api/test/all", controller.allAccess);
    
    app.get(
        "api/test/token",
        [authJWT.verifyToken]
    );

    app.get(
        "/api/test/sysadmin",
        [authJWT.verifyToken, authJWT.isSysadmin],
        controller.webdevBoard
    );
    
    app.get(
        "/api/users",
        [authJWT.verifyToken, authJWT.isSysadmin],
        controller.getAll
    )
}

