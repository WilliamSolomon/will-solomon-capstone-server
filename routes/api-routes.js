const router = require("express").Router();
const apiController = require("../controllers/api-controller");


router
    .route("/alerts/user/:id")
    .get(apiController.getAllUserAlerts)

router
    .route("/alerts/:id/")
    .post(apiController.addAlert)
    .put(apiController.editAlert)
    .delete(apiController.removeAlert)

router
    .route("/settings/user/:id")
    .get(apiController.getUserAlertSettings)

router
    .route("/settings/:id/")
    .post(apiController.addAlertSetting)
    .put(apiController.editAlertSetting)
    .delete(apiController.removeAlertSetting)

module.exports = router;

