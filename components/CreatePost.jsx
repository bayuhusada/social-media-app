'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CreatePost({ onPostCreated, postToEdit }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (postToEdit) {
      setContent(postToEdit.content)
      // Note: We can't set the image here as we don't have access to the file object
    }
  }, [postToEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = supabase.auth.user()
      if (!user) throw new Error('User not authenticated')

      let imageUrl = postToEdit ? postToEdit.image_url : null
      if (image) {
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`${user.id}/${Date.now()}.jpg`, image)
        if (error) throw error
        imageUrl = data.path
      }

      const postData = {
        user_id: user.id,
        content,
        image_url: imageUrl,
      }

      let error
      if (postToEdit) {
        const { error: updateError } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postToEdit.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('posts')
          .insert(postData)
        error = insertError
      }

      if (error) throw error

      setContent('')
      setImage(null)
      onPostCreated()
    } catch (error) {
      alert(error.message)
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
        {loading ? 'Posting...' : (postToEdit ? 'Update Post' : 'Create Post')}
      </button>
    </form>
  )
}

