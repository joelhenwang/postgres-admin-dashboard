const authJWT = require("../middleware/authJWT");
const controller = require("../controllers/user.controller");

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept",
		);

		next();
	});

	app.get("/api/test/all", controller.allAccess);

	app.get("api/test/token", [authJWT.verifyToken]);

	app.get(
		"/api/test/sysadmin",
		[authJWT.verifyToken, authJWT.isSysadmin],
		controller.webdevBoard,
	);

	app.get(
		"/api/users",
		[authJWT.verifyToken, authJWT.isSysadmin],
		controller.safeGetAll,
	);
	
	app.post(
		"/api/users/add",
		[authJWT.verifyToken, authJWT.isSysadmin],
		controller.safeCreate,
	);
	
	app.delete(
		"/api/users/delete",
		[authJWT.verifyToken, authJWT.isSysadmin],
		controller.safeDelete,
	);
	
	app.delete(
		"/api/users/delete/batch",
 		[authJWT.verifyToken, authJWT.isSysadmin],
		controller.safeBatchDelete,
	);
};
