import multer from "multer";

/*
  Use memory storage because we directly stream to Cloudinary.
  No files stored locally.
*/
const storage = multer.memoryStorage();

/*
  Allow only image files.
*/
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

export default upload;