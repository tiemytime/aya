import React, { useState, useEffect } from 'react';
import { useUserProfile, useUpdateProfile } from '@/hooks';
import { Button } from '@/components/UI';
import { useNavigate } from 'react-router-dom';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading, error: userError } = useUserProfile();
  const { updateProfile, isLoading: updateLoading, error: updateError } = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePicture: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Only send fields that have changed
      const updateData: { name?: string; bio?: string; profilePicture?: string } = {};
      
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }
      if (formData.bio !== user?.bio) {
        updateData.bio = formData.bio;
      }
      if (formData.profilePicture !== user?.profilePicture) {
        updateData.profilePicture = formData.profilePicture;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
        setSuccessMessage('Profile updated successfully!');
        
        // Navigate back to profile after successful update
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setSuccessMessage('No changes to save.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  // Helper function to render starry background
  const renderStarryBackground = () => {
    return (
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
    );
  };

  if (userLoading) {
    return (
      <div className="relative w-screen min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden text-white">
        {/* Starry background */}
        <div className="absolute inset-0 opacity-40">
          {renderStarryBackground()}
        </div>
        
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="ml-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="relative w-screen min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden text-white">
        {/* Starry background */}
        <div className="absolute inset-0 opacity-40">
          {renderStarryBackground()}
        </div>
        
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error loading profile: {userError.message}</p>
            <Button onClick={() => navigate('/profile')} className="bg-blue-600 hover:bg-blue-700">
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden text-white">
      {/* Starry background */}
      <div className="absolute inset-0 opacity-40">
        {renderStarryBackground()}
      </div>

      {/* Cosmic glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-96 h-96 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 25%, transparent 70%)',
            animationDuration: '4s'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/profile')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-white font-bold text-xl">AYA</div>
          </div>
          
          <div className="text-white font-medium tracking-wide">
            Edit Profile
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto px-8 pb-20">
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-lg p-8 border border-gray-600">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Edit Profile</h1>
            
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-green-600 bg-opacity-20 border border-green-600 text-green-400 text-center">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {updateError && (
              <div className="mb-6 p-4 rounded-lg bg-red-600 bg-opacity-20 border border-red-600 text-red-400 text-center">
                Error updating profile: {updateError.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Profile Picture Preview */}
              <div className="text-center">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full border-4 border-gray-600 object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-gray-600 bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-60 text-white border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-400"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Bio Field */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-60 text-white border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-400 resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Share a bit about yourself, your spiritual journey, or what prayer means to you.
                </p>
              </div>

              {/* Profile Picture URL Field */}
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 bg-opacity-60 text-white border border-gray-600 focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-400"
                  placeholder="https://example.com/your-profile-picture.jpg"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter a URL to an image you'd like to use as your profile picture.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || updateLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting || updateLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting || updateLoading}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>

            {/* Account Info */}
            <div className="mt-8 pt-8 border-t border-gray-600 text-center">
              <p className="text-sm text-gray-400">
                Email: <span className="text-white">{user?.email}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                To change your email address, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
