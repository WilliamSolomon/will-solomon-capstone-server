const router = require("express").Router();
const apiController = require("../controllers/api-controller");
const authorize = require("../middleware/authorize");


router
    .route("/users/register")
    .post(apiController.registerNewUser)

router
    .route("/users/login")
    .post(apiController.loginAuthenticate)

router
    .route("/users/current")
        .get(
        authorize,
        apiController.getCurrentUser)

// router
//     .route("/")
//         .get(
//             authorize,
//             apiController.getAllUsers)

router
    .get("/weather/current/", apiController.getCurrentWeather);

router
    .get("/weather/forecast/", apiController.getForecastWeather);

router
    .route("/alerts/user/:id")
    .get(apiController.getAllUserAlerts)

router
    .route("/alerts/")
    .post(apiController.addAlert)

router
    .route("/alerts/:id/")
    .put(apiController.editAlert)
    .delete(apiController.archiveAlert)

router
    .route("/settings/user/:id")
    .get(apiController.getUserAlertSettings)

router
    .route("/settings/")
    .post(apiController.addAlertSetting)

router
    .route("/settings/:id")
    .get(apiController.getAlertSetting)
    .put(apiController.editAlertSetting)
    .delete(apiController.removeAlertSetting)

// router
//     .route("/users/:id")
//     .get(apiController.getUserData)

module.exports = router;

