'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Post from './Post'

export default function PostList({ userId }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [userId])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let query = supabase.from('posts').select('*').order('created_at', { ascending: false })
      
      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query
      if (error) throw error
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostUpdated = () => {
    fetchPosts()
  }

  if (loading) {
    return <div>Loading posts...</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} onPostUpdated={handlePostUpdated} />
      ))}
    </div>
  )
}

