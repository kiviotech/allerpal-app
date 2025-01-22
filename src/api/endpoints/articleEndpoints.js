const articleEndpoints = {
    getAllArticle: "/articles?populate=*",
    getArticleById: (id) => `/articles/${id}?populate=*`,
    createArticle: "/articles",
    updateArticle: (id) => `/articles/${id}`,
    deleteArticle: (id) => `/articles/${id}`,
};

export default articleEndpoints;