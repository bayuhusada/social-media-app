'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import PostList from '../../components/PostList'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true)
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError

        if (user) {
          setUser(user)
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profileError) throw profileError

          setProfile(profileData)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        alert('Error fetching user data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [router])

  const updateProfile = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: profile.username })
        .eq('id', user.id)
      if (error) throw error
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  if (!profile) {
    return <div>No profile found. Please log in again.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="mb-4">Welcome, {profile.username}!</p>
      <form onSubmit={updateProfile} className="mb-8">
        <input
          type="text"
          value={profile.username || ''}
          onChange={(e) => setProfile({...profile, username: e.target.value})}
          placeholder="Username"
          className="w-full p-2 border rounded mb-2"
        />
        <button 
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Update Profile
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">My Posts</h2>
      <PostList userId={user?.id} />
    </div>
  )
}

