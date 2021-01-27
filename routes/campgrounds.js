const express = require("express");
const router = express.Router();
const {storage} = require("../cloudinary");
const multer = require("multer")
const upload = multer({storage})
const catchAsync = require("../utils/catchAsync");
const {index, newCampground, postNewCampground, show, edit, putEdit, deleteCampground} = require("../controllers/campgrounds");
const {isLoggedIn, validateCampground, isAuthor} = require("../utils/middleware");

router.get("/", catchAsync(index));
router.get("/new", isLoggedIn, newCampground);
router.post("/", isLoggedIn, upload.array('image'), validateCampground, catchAsync(postNewCampground));
router.get("/:id", catchAsync(show));
router.get("/:id/edit", isLoggedIn, isAuthor, edit);
router.put("/:id", isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(putEdit));
router.delete("/:id", isLoggedIn, isAuthor, deleteCampground);

module.exports = router;
