import articleEndpoints from "../endpoints/articleEndpoints";
import apiClient from "../apiClient";

export const getAllArticle = () => apiClient.get(articleEndpoints.getAllArticle);

export const getArticleById = (id) => apiClient.get(articleEndpoints.getArticleById(id));

export const createArticle = (data) => 
  apiClient.post(articleEndpoints.createArticle, data);

export const updateArticle = (id, data) => 
  apiClient.put(articleEndpoints.updateArticle(id), data);

export const deleteArticle = (id) => 
  apiClient.delete(articleEndpoints.deleteArticle(id));
