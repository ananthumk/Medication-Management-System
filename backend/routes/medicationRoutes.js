const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMedications, addMedication, markTaken,deleteMedication,updateMedication } = require("../controllers/medicationController");

router.use(auth);
router.get("/", getMedications);
router.post("/", addMedication);
router.patch("/:id/taken", markTaken);
router.delete("/:id",deleteMedication);
router.put("/:id",updateMedication);



module.exports = router;
