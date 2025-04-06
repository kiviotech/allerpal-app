const restaurantImportEndpoints = {
  // Upload endpoints
  uploadImportFile: '/restaurant-import/upload',
  importJsonData: '/restaurant-import/import-json',
  processUploadedFile: '/restaurant-import/process-uploaded-file',
  
  // Template endpoints
  downloadTemplate: '/restaurant-import/download-template',
  
  // Import management endpoints
  listImports: (page = 1, pageSize = 10) => {
    // Use the simplest query possible
    return `/restaurant-import?_limit=${pageSize}&_start=${(page - 1) * pageSize}`;
  },
  getImportById: (id) => `/restaurant-import/${id}`,
  
  // Validation endpoint
  validateImport: '/restaurant-import/validate',
};

export default restaurantImportEndpoints; 