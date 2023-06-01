const subSectionModel = require("../models/subSectionModel");
const sectionModel = require("../models/SectionModel");
const { fileUploadCloudinary } = require("../utils/fileUploadCloudinary");
require("dotenv").config();

const createSubSection = async (req, res) => {
  try {
    // fetch data from req body
    const { sectionId, title, duration, description } = req.body;

    // fetch video from req files
    const video = req.files.video;

    // validation
    if (!sectionId || !title || !duration || !description || !video) {
      return res.status(404).json({
        success: false,
        message: "All details are not present",
      });
    }
    // upload video to cloudinary
    const uploadUrl = await fileUploadCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create entry of sub-section in db
    const saveSubSection = await subSectionModel.create({
      title,
      description,
      duration,
      videoUrl: uploadUrl.secure_url,
    });
    // push id of sub-section in section model

    //todo: check that populate works or not
    await sectionModel
      .findByIdAndUpdate(
        sectionId,
        {
          $push: { subSection: saveSubSection._id },
        },
        { new: true }
      )
      .populate("subSection")
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Sub section created successfully",
    });
  } catch (error) {
    console.error("error while creating sub section", error);
    return res.status(500).json({
      success: false,
      message: "sub-section creation failed",
      error,
    });
  }
};

const updateSubSection = async (req, res) => {
  try {
    const { title, description, duration, subSectionId } = req.body;
    const video = req.files.video;

    if (!subSectionId || !title || !duration || !description || !video) {
      return res.status(404).json({
        success: false,
        message: "All details are not present",
      });
    }

    const uploadUrl = await fileUploadCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    await subSectionModel.findByIdAndUpdate(
      subSectionId,
      {
        title,
        description,
        duration,
        videoUrl: uploadUrl.secure_url,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "sub section updated successfully",
    });
  } catch (error) {
    console.error("error while updating sub section", error);
    return res.status(500).json({
      success: false,
      message: "sub-section updation failed",
      error,
    });
  }
};

const deleteSubSection = async (req, res) => {
  try {
    const {sectionId} = req.params;
    const { subSectionId } = req.body;

    console.log("Printing", req.body);

    if (!subSectionId) {
      return res.json({
        success: false,
        message: "Sub Section id not present",
      });
    }

    await sectionModel.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSection: subSectionId },
      },
      { new: true }
    );

    await subSectionModel.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
    });
  } catch (error) {
    console.error("error while deleting sub section", error);
    return res.status(500).json({
      success: false,
      message: "sub-section deletion failed",
      error,
    });
  }
};

module.exports = { createSubSection, updateSubSection, deleteSubSection };
