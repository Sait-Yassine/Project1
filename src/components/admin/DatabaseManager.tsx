'use client';

import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  courseId: string;
}

export const DatabaseManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'videos'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    courseId: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const endpoint = activeTab === 'courses' ? '/api/admin/courses' : '/api/admin/videos';
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      if (activeTab === 'courses') {
        setCourses(data);
      } else {
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!newItem.title || !newItem.description) {
        setError('Title and description are required');
        return;
      }

      if (activeTab === 'videos' && !newItem.courseId) {
        setError('Please select a course');
        return;
      }

      if (!newItem.thumbnailUrl) {
        setError('Please upload a thumbnail');
        return;
      }

      if (activeTab === 'videos' && !newItem.videoUrl) {
        setError('Please upload a video');
        return;
      }

      const endpoint = activeTab === 'courses' ? '/api/admin/courses' : '/api/admin/videos';
      const payload = activeTab === 'courses' 
        ? {
            title: newItem.title,
            description: newItem.description,
            thumbnail: newItem.thumbnailUrl
          }
        : {
            title: newItem.title,
            description: newItem.description,
            thumbnail: newItem.thumbnailUrl,
            videoUrl: newItem.videoUrl,
            courseId: newItem.courseId
          };

      console.log('Sending payload:', payload); // Debug log

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('brilliant_token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create item');
      }

      await fetchData();
      setIsModalOpen(false);
      setNewItem({
        title: '',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
        courseId: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'thumbnail' | 'video'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('title', newItem.title || 'untitled');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    console.log('Upload response:', data);
    return data.url;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded ${
              activeTab === 'videos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Videos
          </button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New
        </button>
      </div>

      {/* List View */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'courses' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="relative w-full h-48 mb-4">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl.startsWith('http') ? course.thumbnailUrl : `/${course.thumbnailUrl}`}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement?.classList.add('bg-gray-200');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📷</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4">
                <div className="relative w-full h-48 mb-4 group">
                  {video.thumbnailUrl ? (
                    <>
                      <img
                        src={video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `/${video.thumbnailUrl}`}
                        alt={video.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement?.classList.add('bg-gray-200');
                        }}
                      />
                      {video.videoUrl && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                          <button 
                            onClick={() => window.open(video.videoUrl.startsWith('http') ? video.videoUrl : `/${video.videoUrl}`, '_blank')}
                            className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                          >
                            <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">🎥</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600">{video.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Add New {activeTab === 'courses' ? 'Course' : 'Video'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              {activeTab === 'videos' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    value={newItem.courseId}
                    onChange={(e) => setNewItem({ ...newItem, courseId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                <FileUpload
                  onFileSelect={async (file: File) => {
                    try {
                      const url = await handleFileUpload(file, 'thumbnail');
                      setNewItem({ ...newItem, thumbnailUrl: url });
                    } catch {
                      setError('Failed to upload thumbnail');
                    }
                  }}
                  accept="image/*"
                  label="Upload Thumbnail"
                />
              </div>
              {activeTab === 'videos' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Video</label>
                  <FileUpload
                    onFileSelect={async (file: File) => {
                      try {
                        const url = await handleFileUpload(file, 'video');
                        setNewItem({ ...newItem, videoUrl: url });
                      } catch {
                        setError('Failed to upload video');
                      }
                    }}
                    accept="video/*"
                    label="Upload Video"
                  />
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewItem({
                      title: '',
                      description: '',
                      thumbnailUrl: '',
                      videoUrl: '',
                      courseId: ''
                    });
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 