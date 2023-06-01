const sectionModel = require("../models/SectionModel");
const courseModel = require("../models/courseModel");
const subSectionModel = require("../models/subSectionModel");

const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    console.log(courseId);

    if (!sectionName) {
      return res.status(404).json({
        success: false,
        message: "Section name missing",
      });
    }

    if (!courseId) {
      return res.status(404).json({
        success: false,
        message: "course Id missing",
      });
    }

    const saveSection = await sectionModel.create({
      sectionName: sectionName,
    });

    console.log("section Created", saveSection);

    await courseModel
      .findByIdAndUpdate(
        { _id: courseId },
        {
          $push: { courseContent: saveSection._id },
        },
        { new: true }
      )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section created successfully",
    });
  } catch (error) {
    console.error("Error while creating section", error);
    res.status(500).json({
      success: false,
      message: `Error while creating section with error -> ${error.message}`,
    });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName) {
      return res.status(404).json({
        success: false,
        message: "Section name missing",
      });
    }

    if (!sectionId) {
      return res.status(404).json({
        success: false,
        message: "section Id missing",
      });
    }

    await sectionModel.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Error while updating section -> ${error.message}`,
    });
  }
};

const deleteSection = async (req, res) => {
  try {
    //change to params while building frontend
    const { sectionId } = req.body;
    const { courseId } = req.params;

    const checkSection = await sectionModel.findById(sectionId);

    checkSection.subSection.forEach(async (id) => {
      await subSectionModel.findByIdAndDelete(id);
      await sectionModel.findByIdAndUpdate(
        sectionId,
        {
          $pull: { subSection: id },
        },
        { new: true }
      );
    });

    await sectionModel.findByIdAndDelete(sectionId);
    //Todo: do we need to delete the entry from course schema?
    await courseModel.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Section Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Error while deleting section -> ${error.message}`,
    });
  }
};

module.exports = { createSection, updateSection, deleteSection };
