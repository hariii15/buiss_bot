import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { FiUser, FiBriefcase, FiMail, FiType, FiGlobe, FiUsers, FiTarget, FiAlertTriangle, FiCalendar, FiEdit, FiSave, FiXCircle, FiLoader } from 'react-icons/fi' // Added Save, XCircle, Loader

// Initialize Supabase client
const supabaseUrl = 'https://wvjuhrxgibiyukzxedrc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2anVocnhnaWJpeXVrenhlZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjAxNDcsImV4cCI6MjA1OTY5NjE0N30.L6OKP_dVbvZvlvRQJc7APcu3MbP1aWBmzrMiCA7nxf0'
const supabase = createClient(supabaseUrl, supabaseKey)

const Profile = () => {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false) // State for edit mode
  const [editedData, setEditedData] = useState({}) // State for form data during edit
  const [isSaving, setIsSaving] = useState(false) // State for save operation
  const [saveMessage, setSaveMessage] = useState('') // Message after save attempt

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      setError(null)
      setSaveMessage('') // Clear save message on load
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // Handle case where profile doesn't exist yet
            setError('Profile not found. Please complete your business profile.')
          } else {
            throw fetchError
          }
        } else {
          setProfileData(data)
          setEditedData(data) // Initialize editedData with fetched data
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err.message || 'Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  // Handle saving the edited data
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    setError(null); // Clear previous errors
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Prepare data for update (exclude id, email, created_at if they shouldn't be updated)
      const { id, email, created_at, ...updateData } = editedData;

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfileData(editedData); // Update local profile data state
      setIsEditing(false); // Exit edit mode
      setSaveMessage('Profile updated successfully!');
      // Force reload to update business info in App.jsx and redirect correctly
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedData(profileData); // Reset edited data to original
    setIsEditing(false);
    setError(null); // Clear any errors shown during edit attempt
  };

  // Helper component for profile fields with icons
  const ProfileField = ({ icon: Icon, label, value, isTextArea = false }) => (
    <div className="flex items-start space-x-4 py-4">
      <Icon className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
      <div className="flex-1">
        <dt className="text-sm font-semibold text-gray-400">{label}</dt>
        <dd className={`mt-1 text-sm text-gray-100 ${isTextArea ? 'whitespace-pre-wrap' : ''}`}>
          {value || <span className="italic text-gray-500">Not provided</span>}
        </dd>
      </div>
    </div>
  )

  // Helper component for editable fields (edit mode)
  const EditableField = ({ name, label, value, onChange, isTextArea = false, required = false, options = null }) => (
    <div className="py-3">
      <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          rows={3}
          className="w-full p-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition duration-200"
          placeholder={`Enter ${label.toLowerCase()}`}
          required={required}
        />
      ) : options ? (
         <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full p-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition duration-200"
            required={required}
          >
            <option value="">{`Select ${label.toLowerCase()}`}</option>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full p-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition duration-200"
          placeholder={`Enter ${label.toLowerCase()}`}
          required={required}
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900"> {/* Adjust height based on navbar */}
        <div className="text-white text-xl">Loading Profile...</div>
      </div>
    )
  }

  if (error && error.includes('Profile not found')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900 text-center px-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/business-form">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            Complete Profile
          </button>
        </Link>
      </div>
    )
  }

  if (!profileData && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-900">
        <p className="text-gray-400">No profile data available or failed to load.</p>
      </div>
    )
  }

  // Define options for select dropdowns
  const businessTypeOptions = [
    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "LLC", label: "LLC" },
    { value: "Corporation", label: "Corporation" },
    { value: "Nonprofit", label: "Nonprofit" },
    { value: "Other", label: "Other" },
  ];

  const industryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Retail", label: "Retail" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Food & Beverage", label: "Food & Beverage" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Other", label: "Other" },
  ];

  const companySizeOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501+", label: "501+ employees" },
  ];

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8"> {/* Adjust height */}
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gray-800 shadow-xl rounded-lg mb-8 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{profileData.business_name || 'Business Profile'}</h2>
            <p className="text-sm text-gray-400">Registered Email: {profileData.email || 'N/A'}</p>
          </div>
          {!isEditing && ( // Show Edit button only in display mode
            <button
              onClick={() => { setIsEditing(true); setSaveMessage(''); setError(null); }} // Enter edit mode
              className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center text-sm"
            >
              <FiEdit className="mr-2 h-4 w-4"/> Edit Profile
            </button>
          )}
        </div>

        {/* Display Save Message or Error */}
         {saveMessage && <div className="mb-4 p-3 rounded-md bg-green-600 text-white text-sm">{saveMessage}</div>}
         {error && !error.includes('Profile not found') && <div className="mb-4 p-3 rounded-md bg-red-600 text-white text-sm">{error}</div>}

        {/* Details Card - Conditional Rendering */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">
              {isEditing ? 'Edit Business Details' : 'Business Details'}
            </h3>
          </div>
          <div className="px-6 py-5">
            {isEditing ? (
              // EDIT MODE FORM
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                   <EditableField name="business_name" label="Business Name" value={editedData.business_name} onChange={handleEditChange} required />
                   <EditableField name="business_type" label="Business Type" value={editedData.business_type} onChange={handleEditChange} required options={businessTypeOptions} />
                   <EditableField name="industry" label="Industry" value={editedData.industry} onChange={handleEditChange} required options={industryOptions} />
                   <EditableField name="company_size" label="Company Size" value={editedData.company_size} onChange={handleEditChange} options={companySizeOptions} />
                </div>
                 <EditableField name="business_description" label="Business Description" value={editedData.business_description} onChange={handleEditChange} isTextArea required />
                 <EditableField name="goals" label="Goals" value={editedData.goals} onChange={handleEditChange} isTextArea />
                 <EditableField name="challenges" label="Challenges" value={editedData.challenges} onChange={handleEditChange} isTextArea />

                {/* Action Buttons for Edit Mode */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition duration-300 text-sm flex items-center"
                  >
                    <FiXCircle className="mr-2 h-4 w-4"/> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-md ${isSaving ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white transition duration-300 text-sm flex items-center`}
                  >
                    {isSaving ? <FiLoader className="animate-spin mr-2 h-4 w-4"/> : <FiSave className="mr-2 h-4 w-4"/>}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              // DISPLAY MODE
              <dl className="divide-y divide-gray-700">
                <ProfileField icon={FiBriefcase} label="Business Name" value={profileData.business_name} />
                <ProfileField icon={FiType} label="Business Type" value={profileData.business_type} />
                <ProfileField icon={FiGlobe} label="Industry" value={profileData.industry} />
                <ProfileField icon={FiUsers} label="Company Size" value={profileData.company_size} />
                <ProfileField icon={FiUser} label="Business Description" value={profileData.business_description} isTextArea={true} />
                <ProfileField icon={FiTarget} label="Goals" value={profileData.goals} isTextArea={true} />
                <ProfileField icon={FiAlertTriangle} label="Challenges" value={profileData.challenges} isTextArea={true} />
                <ProfileField icon={FiCalendar} label="Profile Created" value={new Date(profileData.created_at).toLocaleDateString()} />
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
