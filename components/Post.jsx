'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import CreatePost from './CreatePost'

export default function Post({ post, onPostUpdated }) {
  const [editing, setEditing] = useState(false)

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
      if (error) throw error
      onPostUpdated()
    } catch (error) {
      alert('Error deleting post: ' + error.message)
    }
  }

  if (editing) {
    return (
      <CreatePost
        postToEdit={post}
        onPostCreated={() => {
          setEditing(false)
          onPostUpdated()
        }}
      />
    )
  }

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <p className="mb-2">{post.content}</p>
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full mb-2 rounded" />
      )}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

