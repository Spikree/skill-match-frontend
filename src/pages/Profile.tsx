import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Star,
  Link as LinkIcon,
  Edit3,
  Save,
  X,
} from "lucide-react";

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

const Profile = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<
    UserDetails["profile"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/profile/getUser");
        setUserDetails(response.data.userDetails);
        setError(null);
      } catch (error) {
        setError("Failed to load profile. Please try again later.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserDetails();
  }, []);

  const handleEditClick = () => {
    if (userDetails) {
      setEditedProfile({ ...userDetails.profile });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(null);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    try {
      setIsSaving(true);
      const editProfileData = {
        name: editedProfile.name,
        bio: editedProfile.bio,
        skills: editedProfile.skills,
        portfolio: editedProfile.portfolio,
      };

      await axiosInstance.put("/profile/edit", editProfileData);

      setUserDetails((prev) =>
        prev
          ? {
              ...prev,
              profile: editedProfile,
            }
          : undefined
      );

      setIsEditing(false);
      setEditedProfile(null);
      setError(null);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof UserDetails["profile"],
    value: string | string[]
  ) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value,
    });
  };

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
                  {isEditing ? editedProfile?.name : userDetails.profile.name}
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mt-1">
                  {userDetails.role}
                </p>
              </div>
            </div>
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditClick}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-3 bg-white rounded-lg flex items-center justify-center gap-2 text-blue-600 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </motion.button>
              </div>
            )}
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
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedProfile?.portfolio}
                        onChange={(e) =>
                          handleInputChange("portfolio", e.target.value)
                        }
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <a
                        href={userDetails.profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {userDetails.profile.portfolio}
                      </a>
                    )}
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
              {isEditing ? (
                <textarea
                  value={editedProfile?.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={6}
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">
                  {userDetails.profile.bio}
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Skills
              </h2>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile?.skills.join(", ")}
                  onChange={(e) =>
                    handleInputChange(
                      "skills",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Separate skills with commas"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userDetails.profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
