import { getAllReviews ,createReview} from "../api/repositories/reviewRepositories";

export const fetchReviews = async () => {
    try {
        const response = await getAllReviews();
        return response.data;
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return [];
    }
};

// function for sending the reviews

export const submitReview = async (reviewData) =>{
    try{
        const response = await createReview(reviewData)
        return response.data
    }
    catch(error){
        console.log('failed to submit review:',error)
        throw new Error('Error submitted review')
    }
}