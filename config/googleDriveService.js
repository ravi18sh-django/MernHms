const { google } = require("googleapis");
const stream = require("stream");
require("dotenv").config();

// Google Auth Setup
const auth = new google.auth.JWT(
  process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, "\n"), 
  ["https://www.googleapis.com/auth/drive"]
);
console.log("Client Email:", process.env.GOOGLE_DRIVE_CLIENT_EMAIL);
console.log("Private Key:", process.env.GOOGLE_DRIVE_PRIVATE_KEY ? "Loaded" : "Not Loaded");


const drive = google.drive({ version: "v3", auth });


const uploadFileToDrive = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("Invalid file data");
    }


    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], 
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream, 
      },
      fields: "id, name, parents", 
    });

    if (!response.data || !response.data.id) {
      throw new Error("Drive upload failed");
    }

    

    
    const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;

    return {
      fileId: response.data.id,
      fileName: file.originalname,
      fileUrl: fileUrl, 
    };
  } catch (error) {
    console.error("Error uploading to Drive:", error.message);
    return null;
  }
};

const checkIfFileExists = async (fileId) => {
  try {
    await drive.files.get({ fileId });
    return true; // File exists
  } catch (error) {
    if (error.code === 404) {
      return false; // File does not exist
    }
    throw error; // Some other error occurred
  }
};


const deleteFileFromDrive = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error("File ID is required");
    }

    await drive.files.delete({ fileId });
    console.log(`File with ID ${fileId} deleted successfully.`);
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file from Drive:", error.message);
    return { success: false, message: error.message };
  }
};


module.exports = { uploadFileToDrive,deleteFileFromDrive ,checkIfFileExists};
