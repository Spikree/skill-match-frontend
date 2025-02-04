import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

type Props = {
    userId: string;
    setShowRatingModal: (show: boolean) => void;
}

const RateUser: React.FC<Props> = ({ userId, setShowRatingModal }) => {
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [hoverRating, setHoverRating] = useState<number>(0);

    const rateUser = async () => {
        try {
            const response = await axiosInstance.post(`/review/post/${userId}`, {
                rating: rating,
                review: review
            });
            console.log(response);
            setShowRatingModal(false);
        } catch (error) {
            console.log(error);
        }
    }

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <motion.div 
                    key={i}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer"
                >
                    <Star 
                        size={40} 
                        fill={i <= (hoverRating || rating) ? "#FFD700" : "none"}
                        stroke={i <= (hoverRating || rating) ? "#FFD700" : "gray"}
                        className="transition-colors duration-200"
                    />
                </motion.div>
            );
        }
        return stars;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Rate User</h2>
                
                <div className="flex justify-center space-x-2 mb-4">
                    {renderStars()}
                </div>
                
                {rating > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <textarea 
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review (optional)"
                            className="w-full p-2 border rounded mt-4 min-h-[100px]"
                        />
                    </motion.div>
                )}
                
                <div className="flex justify-between mt-4">
                    <motion.button 
                        onClick={() => setShowRatingModal(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </motion.button>
                    
                    <motion.button 
                        onClick={rateUser}
                        disabled={rating === 0}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded ${
                            rating === 0 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Submit Rating
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

export default RateUser;