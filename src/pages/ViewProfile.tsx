import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Star, Link as LinkIcon } from "lucide-react";
import { useParams } from "react-router-dom";

type UserDetails = {
  createdOn: string;
  email: string;
  profile: {
    bio: string;
    name: string;
    portfolio: string;
    rating: number;
    skills: string[];
  };
  role: string;
};

type Review = {
  rating: number;
  review: string;
  reviewOf: string;
  reviewer: string;
  _id: string;
};

const ViewProfile = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { userId } = useParams();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/profile/getUserProfile/${userId}`);
        console.log(response)
        setUserDetails(response.data.userDetails);
        setError(null);
      } catch (error) {
        setError("Failed to load profile. Please try again later.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const getReview = async () => {
      try {
        const response = await axiosInstance.get(
          `/review/getReviews/${userId}`
        );
        setReviews(response.data.reviews);
      } catch (error) {
        console.log(error);
      }
    };

    getReview();
    getUserDetails();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 sm:bg-white rounded-md h-full overflow-y-scroll mt-16 sm:mt-0">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="space-y-3">
                  <div className="h-8 w-48 bg-white/10 rounded"></div>
                  <div className="h-6 w-32 bg-white/10 rounded"></div>
                </div>
              </div>
              <div className="h-12 w-36 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <div className="h-6 w-1/2 bg-gray-100 rounded mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-5 w-full bg-gray-100 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 w-1/2 bg-gray-100 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-4 w-full bg-gray-100 rounded"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 w-1/2 bg-gray-100 rounded mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-8 w-20 bg-gray-100 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 sm:bg-white rounded-md h-full overflow-y-scroll mt-16 sm:mt-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {userDetails.profile.name}
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mt-1">
                  {userDetails.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="break-all">{userDetails.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span>Joined on {formatDate(userDetails.createdOn)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>{userDetails.profile.rating.toFixed(1)} Rating</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-start sm:items-center gap-3 text-gray-600">
                    <LinkIcon className="w-5 h-5 flex-shrink-0 mt-1 sm:mt-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Skills
              </h2>
            </div>
          </div>
        </div>
      </div>
      {reviews?.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reviews</h2>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {review.reviewer}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <motion.p 
                    className="text-gray-600 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {review.review}
                  </motion.p>
                </div>
                
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
