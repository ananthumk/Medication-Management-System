const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMedications, addMedication, markTaken } = require("../controllers/medicationController");

router.use(auth);
router.get("/", getMedications);
router.post("/", addMedication);
router.patch("/:id/taken", markTaken);

module.exports = router;
