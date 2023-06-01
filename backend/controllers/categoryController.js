const categoryModel = require("../models/categoryModel");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      console.error("Error while receiving data", error);
      return res.status(404).json({
        success: false,
        message: "Fill all required Fields",
      });
    }

    const saveCategory = await categoryModel.create({
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      category: saveCategory,
      message: "Category created Successfully",
    });
  } catch (error) {
    console.error("Error while creating category", error);
    return res.status(500).json({
      success: false,
      message: `Category creation failed with error: ${error.message}`,
    });
  }
};

const fetchAllCategories = async (req, res) => {
  try {
    const category = await categoryModel.find(
      {},
      { name: true, description: true }
    );

    return res.status(200).json({
      success: true,
      category: category,
      message: "Categories fetched Successfully",
    });
  } catch (error) {
    console.error("Error while creating tag", error);
    return res.status(500).json({
      success: false,
      message: `Category fetching failed with error: ${error.message}`,
    });
  }
};

//Todo: Category page controller

const categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await categoryModel
      .findById(categoryId)
      .populate("course");

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    const differentCategories = await categoryModel
      .find({
        _id: { $ne: categoryId },
      })
      .populate("course")
      .exec();

    const topSellingCourses = async (req, res) => {
      const allCategories = await categoryModel.find().populate("course");
      const allCourses = allCategories.flatMap((category) => category.course);
      return allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10);
    };

    res.status(200).json({
      success: true,
      message: "category details fetched successfully",
      data: {
        topSellingCourses,
        differentCategories,
        selectedCategory,
      },
    });
  } catch (error) {
    console.error("error while fetching category page details", error);
    res.status(500).json({
      success: false,
      message: "error while fetching category page details",
      error: error.message,
    });
  }
};

module.exports = { createCategory, fetchAllCategories, categoryPageDetails };
