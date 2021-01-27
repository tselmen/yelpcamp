const Campground = require("../models/campground");
const mongoose = require("mongoose");
const {cloudinary} = require("../cloudinary")

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.postNewCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`campgrounds/${campground._id}`);
};

module.exports.show = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.edit = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.putEdit = async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground,});
  campground.images.push(...req.files.map(f => ({url: f.path, filename: f.filename})));
  await campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({$pull : {images: {filename: {$in: req.body.deleteImages}}}})
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};