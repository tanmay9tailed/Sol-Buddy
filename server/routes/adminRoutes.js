const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.json({ message: "Get all users route" });
});

module.exports = router;
