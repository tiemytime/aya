import React, { useState } from 'react';
import { useUserProfile, useUserPrayerNotes } from '@/hooks';
import { Button } from '@/components/UI';
import { useNavigate } from 'react-router-dom';
import { PrayerNote } from '@/services';
import { StarfieldBackground } from '@/components/shared';

// Simple Modal component for prayer details
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading, error: userError } = useUserProfile();
  const { data: notesData, isLoading: notesLoading, error: notesError } = useUserPrayerNotes(1, 20);
  const [selectedNote, setSelectedNote] = useState<PrayerNote | null>(null);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleNoteClick = (note: PrayerNote) => {
    setSelectedNote(note);
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (userLoading) {
    return (
      <div className="relative w-screen min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden text-white">
        {/* Starfield Background */}
        <StarfieldBackground />
        
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
        {/* Starfield Background */}
        <StarfieldBackground />
        
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error loading profile: {userError.message}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden text-white">
      {/* Starfield Background */}
      <StarfieldBackground />

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
        <div className="flex items-center justify-between p-12">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-12 h-12 rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="hidden w-12 h-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full opacity-80"></div>
                <div className="absolute inset-1 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-white font-bold text-sm">A</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-white font-medium tracking-wide">
            My Profile
          </div>
        </div>

        {/* Profile Header */}
        <div className="max-w-4xl mx-auto px-8 mb-12">
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-lg p-8 border border-gray-600">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-gray-600 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-gray-600 bg-gray-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user?.name || 'Anonymous User'}
                </h1>
                <p className="text-gray-400 mb-4">{user?.email}</p>
                {user?.bio && (
                  <p className="text-gray-300 mb-6 max-w-lg">{user.bio}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleEditProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Edit Profile
                  </Button>
                  <div className="text-sm text-gray-400">
                    Member since {formatDate(user?.createdAt || '')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Notes Section */}
        <div className="max-w-6xl mx-auto px-8 pb-20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">My Prayer Notes</h2>
          
          {notesLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="ml-4 text-gray-400">Loading prayer notes...</p>
            </div>
          )}

          {notesError && (
            <div className="flex justify-center items-center py-20">
              <p className="text-red-400">Error loading prayer notes: {notesError.message}</p>
            </div>
          )}

          {!notesLoading && !notesError && notesData && (
            <>
              {notesData.data.notes.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🕯️</div>
                  <p className="text-gray-400 text-lg mb-4">You haven't created any prayer notes yet</p>
                  <Button 
                    onClick={() => navigate('/submit-prayer')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-3 rounded-full font-medium"
                  >
                    Create Your First Prayer
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {notesData.data.notes.map((note) => (
                      <div 
                        key={note._id} 
                        className="bg-gray-800 bg-opacity-60 backdrop-blur-sm p-6 rounded-lg cursor-pointer hover:bg-gray-700 hover:bg-opacity-70 transition-all duration-200 transform hover:scale-105 border border-gray-600 hover:border-gray-500"
                        onClick={() => handleNoteClick(note)}
                      >
                        {/* Note Header */}
                        <div className="flex items-center mb-3">
                          <div className="text-2xl mr-2">🕯️</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-sm">Prayer Note</h3>
                            <p className="text-xs text-gray-400">{formatDate(note.createdAt)}</p>
                          </div>
                        </div>
                        
                        {/* Note Content Preview */}
                        <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                          "{note.content.slice(0, 100)}..."
                        </p>
                        
                        {/* Note Details */}
                        <div className="space-y-1 text-xs text-gray-400">
                          <p><span className="text-gray-500">Likes:</span> {note.likes}</p>
                          <p><span className="text-gray-500">Status:</span> {note.isPublic ? 'Public' : 'Private'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination info */}
                  <div className="text-center mt-12">
                    <p className="text-gray-400">
                      Showing {notesData.data.notes.length} of {notesData.data.pagination?.total || 0} prayer notes
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Prayer Note Detail Modal */}
      <Modal 
        isOpen={!!selectedNote} 
        onClose={handleCloseModal} 
        title="Prayer Note Details"
      >
        {selectedNote && (
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-3">🕯️</div>
              <div>
                <h3 className="font-bold text-white text-lg">Prayer Note</h3>
                <p className="text-gray-400 text-sm">Created {formatDate(selectedNote.createdAt)}</p>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg border border-gray-600">
              <p className="text-white text-lg italic leading-relaxed">
                "{selectedNote.content}"
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <p><span className="text-white font-medium">Likes:</span> {selectedNote.likes}</p>
              <p><span className="text-white font-medium">Visibility:</span> {selectedNote.isPublic ? 'Public' : 'Private'}</p>
              <p><span className="text-white font-medium">Category:</span> {selectedNote.category || 'General'}</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => alert('Share functionality coming soon!')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                📤 Share
              </Button>
              <Button 
                onClick={() => alert('Edit functionality coming soon!')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
              >
                ✏️ Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserProfilePage;
