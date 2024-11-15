import {
  uploadFile,
  uploadFileWithId,
  getAllFiles,
  getFileById,
  deleteFileById,
} from "../api/repositories/uploadRepositories";

// Upload a file without specifying an ID
export const uploadNewFile = async (file) => {
  try {
    const response = await uploadFile(file);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Upload a file with a specific ID
export const uploadFileById = async (id, file) => {
  try {
    const response = await uploadFileWithId(id, file);
    return response.data;
  } catch (error) {
    console.error(`Error uploading file with ID ${id}:`, error);
    throw error;
  }
};

// Fetch all uploaded files
export const fetchAllFiles = async () => {
  try {
    const response = await getAllFiles();
    return response.data;
  } catch (error) {
    console.error("Error fetching all files:", error);
    throw error;
  }
};

// Fetch a specific file by ID
export const fetchFileById = async (id) => {
  try {
    const response = await getFileById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching file with ID ${id}:`, error);
    throw error;
  }
};

// Delete a file by ID
export const deleteFileByIdService = async (id) => {
  try {
    const response = await deleteFileById(id); // Call the repository function
    return response.data;
  } catch (error) {
    console.error(`Error deleting file with ID ${id}:`, error);
    throw error;
  }
};
