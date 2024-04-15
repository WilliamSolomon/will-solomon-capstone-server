const router = require("express").Router();
const apiController = require("../controllers/api-controller");

router
    .get("/weather/current/:userId", apiController.getCurrentWeather);
router
    .get("/weather/forecast/:userId", apiController.getForecastWeather);

router
    .route("/alerts/user/:id")
    .get(apiController.getAllUserAlerts)

router
    .route("/alerts/")
    .post(apiController.addAlert)

router
    .route("/alerts/:id/")
    .put(apiController.editAlert)
    .delete(apiController.removeAlert)

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


router
    .route("/users/:id")
    .get(apiController.getUserData)

module.exports = router;

