import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Post({ post }) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
    if (error) console.error('Error fetching comments:', error)
    else setComments(data)
  }

  const handleLike = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ likes: likes + 1 })
      .eq('id', post.id)
    if (error) console.error('Error updating likes:', error)
    else setLikes(likes + 1)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    const user = supabase.auth.user()
    if (!user) return alert('Please login to comment')

    const { error } = await supabase.from('comments').insert({
      post_id: post.id,
      user_id: user.id,
      content: newComment,
    })
    if (error) console.error('Error adding comment:', error)
    else {
      setNewComment('')
      fetchComments()
    }
  }

  return (
    <div className="border p-4 mb-4 rounded">
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full mb-2 rounded" />
      )}
      <p>{post.content}</p>
      <div className="mt-2 flex items-center space-x-4">
        <button onClick={handleLike} className="text-blue-500">
          Like ({likes})
        </button>
        <span>{comments.length} comments</span>
      </div>
      <div className="mt-4">
        {comments.map((comment) => (
          <p key={comment.id} className="text-sm text-gray-600">
            {comment.content}
          </p>
        ))}
      </div>
      <form onSubmit={handleComment} className="mt-4 flex">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded-l"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
          Comment
        </button>
      </form>
    </div>
  )
}

