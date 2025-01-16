'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const fetchUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()
        if (data) setUsername(data.username)
        if (error) console.error('Error fetching username:', error)
      }
    }
    fetchUsername()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      if (!user) throw new Error('User not authenticated')

      let imageUrl = null
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`${user.id}/${fileName}`, image)
        if (error) {
          if (error.message.includes('Bucket not found')) {
            throw new Error('Image storage is not set up. Please contact the administrator.')
          }
          throw error
        }
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(`${user.id}/${fileName}`)
        imageUrl = publicUrl
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content,
        image_url: imageUrl,
        username: username // Add username to the post
      })
      if (error) throw error

      setContent('')
      setImage(null)
      if (onPostCreated) onPostCreated()
      alert('Post created successfully!')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        className="w-full p-2 border rounded"
      />
      <button 
        type="submit" 
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? 'Creating Post...' : 'Create Post'}
      </button>
    </form>
  )
}

