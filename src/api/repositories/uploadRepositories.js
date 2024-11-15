import apiClient from "../apiClient";
import uploadEndpoints from "../endpoints/uploadEndpoints";

export const uploadNewFile = async (formData) => {
  try {
    const response = await apiClient.post(uploadEndpoints.uploadFile, formData);
    return response.data;
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
};

export const uploadFileWithId = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post(uploadEndpoints.uploadFileWithId(id), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllFiles = () => apiClient.get(uploadEndpoints.getAllFiles);

export const getFileById = (id) =>
  apiClient.get(uploadEndpoints.getFileById(id));

export const deleteFileById = (id) =>
  apiClient.delete(uploadEndpoints.deleteFileById(id));
