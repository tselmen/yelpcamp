const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateReview, isReviewAuthor,} = require("../utils/middleware");
const { newReview, deleteReview } = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(newReview));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;
