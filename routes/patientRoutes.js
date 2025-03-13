const express = require("express");
const multer = require("multer");
const Patient = require("../Models/Patient");
const Clinic = require("../Models/Clinic");
const Doctors = require("../Models/Doctor")
const verifyAdmin = require("../middlewares/authMiddleware");
const { uploadFileToDrive, deleteFileFromDrive,checkIfFileExists } = require("../config/googleDriveService");

const router = express.Router();

// Multer Setup (Memory Storage for Google Drive Uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post("/", verifyAdmin, upload.any(), async (req, res) => {

  console.log("🚀 POST request received at /patients",req.body);
  try {
    const { name, email, contact, dob, gender, doctor, clinic, staffSurgeon, diagnosis, age, notes, dateOfAdmission, operationDateTime, dateOfDischarge, dateOfDressing } = req.body;


    // Ensure all required fields are present
    if (!name || !email || !contact || !dob || !gender || !doctor || !clinic || !diagnosis || !age) {

      return res.status(400).json({ isSuccess: false, message: "All required fields (name, email, contact, dob, gender, doctor, clinic, diagnosis, and age) must be provided." });
    }

    console.log("Received body:", req.body);
    if (req.files && req.files.length > 0) {
      console.log("Received files:", req.files);
    }


    // Convert gender to match schema enum
    const formattedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    const allowedGenders = ["Male", "Female", "Other"];
    if (!allowedGenders.includes(formattedGender)) {
      return res.status(400).json({ isSuccess: false, message: `Invalid gender. Allowed values: ${allowedGenders.join(", ")}` });
    }

    // Validate phone number length
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ isSuccess: false, message: "Contact must be exactly 10 digits." });
    }

    // Upload files to Google Drive
    // Upload files to Google Drive
    const documentUrls = [];
    if (req.files && req.files.length > 0) {
      console.log("single file", req.file);
      console.log("multiple files came", req.files);

      for (const file of req.files) {
        console.log("Uploading file:", file.originalname);
        const uploadedFile = await uploadFileToDrive(file);

        console.log("Uploaded file response:", uploadedFile); // Debugging log

        if (!uploadedFile || !uploadedFile.fileId || !uploadedFile.fileName || !uploadedFile.fileUrl) {

          return res.status(500).json({
            isSuccess: false,
            message: `Failed to upload ${file.originalname}. Missing data.`,
          });
        }

        documentUrls.push({
          fileId: uploadedFile.fileId,
          fileName: uploadedFile.fileName,
          fileUrl: uploadedFile.fileUrl, // Now correctly included
        });



        
      }
    }


    // Save patient details in MongoDB
    const newPatient = new Patient({
      name,
      email,
      contact, // Now correctly using `contact`
      dob,
      age: Number(age), // Ensuring `age` is a number
      gender: formattedGender,
      doctor,
      clinic,
      staffSurgeon: staffSurgeon ? staffSurgeon : null,
      notes: notes ? notes : null,
      dateOfAdmission: dateOfAdmission ? dateOfAdmission : null,
      operationDateTime: operationDateTime ? operationDateTime : null,
      dateOfDischarge: dateOfDischarge ? dateOfDischarge : null,
      dateOfDressing: dateOfDressing ? dateOfDressing : null,
      diagnosis,
      documents: documentUrls,
    });

     await newPatient.save();

    //const savedPatient = await newPatient.save();

    const updatedClinic = await Clinic.findByIdAndUpdate(
      clinic,
      { $push: { patients: newPatient._id } },
      { new: true }
  );
    const updatedDoctor = await Doctors.findByIdAndUpdate(
      doctor,
      { $push: { patients: newPatient._id } },
      { new: true }
  );

    res.status(201).json({
      isSuccess: true,
      message: "Patient created successfully",
      data: newPatient,
      updatedClinic,
      updatedDoctor
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(400).json({ isSuccess: false, message: error.message });
  }
});



// ✅ GET all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().populate("doctor clinic staffSurgeon");
    res.status(200).json({
      isSuccess: true,
      message: "Patients fetched successfully",
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("doctor clinic staffSurgeon");
    if (!patient) return res.status(404).json({ isSuccess: false, message: "Patient not found" });

    res.status(200).json({
      isSuccess: true,
      message: "Patient found",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});

/*
router.put("/:id", verifyAdmin, upload.any(),  async (req, res) => {
  try {
    const updates = req.body;
    if (!Object.keys(updates).length)
      return res.status(400).json({ isSuccess: false, message: "No data provided for update" });

    // Upload new files to Google Drive if provided
    const documentUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedFile = await uploadFileToDrive(file);

        documentUrls.push({
          fileId: uploadedFile.fileId,
          fileName: uploadedFile.fileName,
          fileUrl: uploadedFile.fileUrl,
        });
      }
    }

    if (documentUrls.length > 0) {
      updates.documents = documentUrls; // Replace existing files with new ones
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) return res.status(404).json({ isSuccess: false, message: "Patient not found" });
    // added latest for adding the patient id in clinic list
    

    res.status(200).json({
      isSuccess: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(400).json({ isSuccess: false, message: error.message });
  }
});

*/






router.put("/:id", verifyAdmin, upload.any(), async (req, res) => {
  try {
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ isSuccess: false, message: "No data provided for update" });
    }

    // Find the existing patient record
    const existingPatient = await Patient.findById(req.params.id);
    if (!existingPatient) {
      return res.status(404).json({ isSuccess: false, message: "Patient not found" });
    }

    let existingDocuments = existingPatient.documents || [];
    

    // Upload new files to Google Drive if provided
    if (req.files && req.files.length > 0) {
      const uploadedFiles = await Promise.all(req.files.map(async (file) => {
        const uploadedFile = await uploadFileToDrive(file);
        return {
          fileId: uploadedFile.fileId,
          fileName: uploadedFile.fileName,
          fileUrl: uploadedFile.fileUrl,
        };
      }));

      const validExistingDocuments = await Promise.all(
        existingDocuments.map(async (doc) => {
          const exists = await checkIfFileExists(doc.fileId);
          return exists ? doc : null;
        })
      );
    
      existingDocuments = [...validExistingDocuments.filter(Boolean), ...uploadedFiles];
      //existingDocuments = [...existingDocuments, ...uploadedFiles];
    }

    updates.documents = existingDocuments; // Ensure merged documents are updated

    // 🛑 Handle staffSurgeon field properly
    if (updates.staffSurgeon === "") {
      updates.staffSurgeon = null; // Convert empty string to null
    } else if (updates.staffSurgeon && !mongoose.Types.ObjectId.isValid(updates.staffSurgeon)) {
      return res.status(400).json({ isSuccess: false, message: "Invalid staffSurgeon ID" });
    }

    // Update patient record
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      isSuccess: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(400).json({ isSuccess: false, message: error.message });
  }
});



// router.put("/:id", verifyAdmin, upload.any(), async (req, res) => {
//   try {
//     const updates = req.body;

//     if (!Object.keys(updates).length) {
//       return res.status(400).json({ isSuccess: false, message: "No data provided for update" });
//     }

//     // Find the existing patient record
//     const existingPatient = await Patient.findById(req.params.id);
//     if (!existingPatient) {
//       return res.status(404).json({ isSuccess: false, message: "Patient not found" });
//     }

//     let existingDocuments = existingPatient.documents || [];
//     let updatedDocuments = [];

//     // ✅ Handle `documents` JSON parsing safely
//     if (updates.documents) {
//       try {
//         updatedDocuments = typeof updates.documents === "string" 
//           ? JSON.parse(updates.documents) 
//           : updates.documents; // If already an array, use as is
//       } catch (error) {
//         return res.status(400).json({ isSuccess: false, message: "Invalid documents format" });
//       }
//     }

//     console.log("Existing Documents Before Update:", existingDocuments);
//     console.log("Documents from Frontend:", updatedDocuments);

//     // 🔥 **Keep only images that are still in the frontend data**
//     existingDocuments = existingDocuments.filter(doc =>
//       updatedDocuments.some(newDoc => newDoc.fileId === doc.fileId)
//     );

//     console.log("Existing Documents After Filtering:", existingDocuments);

//     // 🚀 **Upload new files to Google Drive if provided**
//     if (req.files && req.files.length > 0) {
//       const uploadedFiles = await Promise.all(req.files.map(async (file) => {
//         const uploadedFile = await uploadFileToDrive(file);
//         return {
//           fileId: uploadedFile.fileId,
//           fileName: uploadedFile.fileName,
//           fileUrl: uploadedFile.fileUrl,
//         };
//       }));

//       existingDocuments = [...existingDocuments, ...uploadedFiles];
//     }

//     updates.documents = existingDocuments; // ✅ Ensure only updated docs are saved

//     // 🛑 Handle staffSurgeon field properly
//     if (updates.staffSurgeon === "") {
//       updates.staffSurgeon = null; // Convert empty string to null
//     } else if (updates.staffSurgeon && !mongoose.Types.ObjectId.isValid(updates.staffSurgeon)) {
//       return res.status(400).json({ isSuccess: false, message: "Invalid staffSurgeon ID" });
//     }

//     // 🚀 **Update patient record**
//     const updatedPatient = await Patient.findByIdAndUpdate(
//       req.params.id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       isSuccess: true,
//       message: "Patient updated successfully",
//       data: updatedPatient,
//     });
//   } catch (error) {
//     console.error("Error updating patient:", error);
//     res.status(400).json({ isSuccess: false, message: error.message });
//   }
// });



// ✅ DELETE a patient by ID (Optionally remove Google Drive files)




router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ isSuccess: false, message: "Patient not found" });

    if (patient.documents && patient.documents.length > 0) {

      for (const fileUrl of patient.documents) {
        const fileId = fileUrl.fileId
        await deleteFileFromDrive(fileId);
      }
    }


    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({
      isSuccess: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});
{/*
router.delete("/deleteimage/:fileId", verifyAdmin, async (req, res) => {
	console.log("aya")
  try {
    const fileId = fileUrl.fileId
    await deleteFileFromDrive(fileId);
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});*/}
router.delete("/deleteimage/:fileId", verifyAdmin, async (req, res) => {
  console.log("aya");

  try {
    const fileId = req.params.fileId; // Extract fileId from URL params
    if (!fileId) {
      return res.status(400).json({ isSuccess: false, message: "File ID is required" });
    }

    await deleteFileFromDrive(fileId);
    res.status(200).json({ isSuccess: true, message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
});


module.exports = router;
