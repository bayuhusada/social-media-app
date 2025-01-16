'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Post({ post, onPostUpdated }) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(post.content)

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

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', post.id)
      if (error) throw error
      setEditing(false)
      onPostUpdated()
    } catch (error) {
      alert('Error updating post: ' + error.message)
    }
  }

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{post.username}</h3>
        <span className="text-sm text-gray-500">
          {new Date(post.created_at).toLocaleString()}
        </span>
      </div>
      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      ) : (
        <p className="mb-2">{post.content}</p>
      )}
      {post.image_url && (
        <img src={post.image_url || "/placeholder.svg"} alt="Post" className="w-full mb-2 rounded" />
      )}
      <div className="flex justify-end space-x-2">
        {editing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
        )}
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

