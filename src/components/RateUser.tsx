import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
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

    const getRatingText = () => {
        const texts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
        return texts[hoverRating || rating] || "Select your rating";
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
                    className="cursor-pointer relative group"
                >
                    <Star 
                        size={44} 
                        fill={i <= (hoverRating || rating) ? "#FFD700" : "none"}
                        stroke={i <= (hoverRating || rating) ? "#FFD700" : "#94A3B8"}
                        strokeWidth={1.5}
                        className="transition-all duration-200 group-hover:stroke-[#FFD700]"
                    />
                </motion.div>
            );
        }
        return stars;
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={(e) => {
                    if (e.target === e.currentTarget) setShowRatingModal(false);
                }}
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 30 
                    }}
                    className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
                >
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowRatingModal(false)}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </motion.button>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Rate Your Experience</h2>
                        <p className="text-gray-500">Your feedback helps improve our community</p>
                    </div>
                    
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex justify-center space-x-1 mb-3">
                            {renderStars()}
                        </div>
                        <motion.p 
                            key={getRatingText()}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg font-medium text-gray-700"
                        >
                            {getRatingText()}
                        </motion.p>
                    </div>
                    
                    <AnimatePresence>
                        {rating > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="relative">
                                    <textarea 
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Share your experience (optional)"
                                        className="w-full p-4 border border-gray-200 rounded-xl mt-2 min-h-[120px] resize-none
                                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                transition-all duration-200 text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <motion.button 
                            onClick={() => setShowRatingModal(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 
                                     transition-colors duration-200 font-medium"
                        >
                            Cancel
                        </motion.button>
                        
                        <motion.button 
                            onClick={rateUser}
                            disabled={rating === 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200
                                ${rating === 0 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                                }`}
                        >
                            Submit Review
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default RateUser;