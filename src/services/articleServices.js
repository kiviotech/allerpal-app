import {
    getAllArticle,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
} from "../api/repositories/articleRepositories";

// Fetch all articles
export const fetchAllArticles = async () => {
    try {
        const response = await getAllArticle();
        return response.data;
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }
};

// Fetch a specific article by ID
export const fetchArticleById = async (id) => {
    try {
        const response = await getArticleById(id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching article with ID ${id}:`, error);
        throw error;
    }
};

// Create a new article
export const createNewArticle = async (data) => {
    try {
        const response = await createArticle(data);
        return response.data;
    } catch (error) {
        console.error("Error creating article:", error);
        throw error;
    }
};

// Update an existing article by ID
export const updateArticleById = async (id, data) => {
    try {
        const response = await updateArticle(id, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating article with ID ${id}:`, error);
        throw error;
    }
};

// Delete an article by ID
export const deleteArticleById = async (id) => {
    try {
        const response = await deleteArticle(id);
        return response.data;
    } catch (error) {
        console.error(`Error deleting article with ID ${id}:`, error);
        throw error;
    }
};
