const uploadEndpoints = {
  uploadFile: "/upload",
  uploadFileWithId: (id) => `/upload?id=${id}`,
  getAllFiles: "/upload/files",
  getFileById: (id) => `/upload/files/${id}`,
  deleteFileById: (id) => `/upload/files/${id}`,
};

export default uploadEndpoints;
