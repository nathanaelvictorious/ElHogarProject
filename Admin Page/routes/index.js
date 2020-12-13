const express = require("express");
const router = express.Router();

// const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => res.render("homepage"));

//dasboard
// router.get("/admin", ensureAuthenticated, (req, res) =>
//   res.render("property/index", {
//     name: req.user.name,
//   })
// );

module.exports = router;
