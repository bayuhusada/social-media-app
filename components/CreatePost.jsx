import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CreatePost() {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = supabase.auth.user()
      if (!user) throw new Error('User not authenticated')

      let imageUrl = null
      if (image) {
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`${user.id}/${Date.now()}.jpg`, image)
        if (error) throw error
        imageUrl = data.path
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content,
        image_url: imageUrl,
      })
      if (error) throw error

      setContent('')
      setImage(null)
      // Show success message or update feed
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Post
      </button>
    </form>
  )
}

