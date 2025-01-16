'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Post from './Post'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      alert('Error fetching posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return <div>Loading posts...</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} onPostUpdated={fetchPosts} />
      ))}
    </div>
  )
}

