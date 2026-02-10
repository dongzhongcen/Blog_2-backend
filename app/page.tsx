export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-black">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          TechBlog API
        </h1>
        <p className="text-emerald-300 mb-8">
          Backend API service for TechBlog
        </p>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-left max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Available Endpoints</h2>
          <ul className="space-y-2 text-emerald-200 text-sm">
            <li>
              <code className="bg-black/30 px-2 py-1 rounded">GET /api/health</code>
              <span className="ml-2">- Health check</span>
            </li>
            <li>
              <code className="bg-black/30 px-2 py-1 rounded">GET /api/posts</code>
              <span className="ml-2">- List all posts</span>
            </li>
            <li>
              <code className="bg-black/30 px-2 py-1 rounded">GET /api/posts/[slug]</code>
              <span className="ml-2">- Get single post</span>
            </li>
            <li>
              <code className="bg-black/30 px-2 py-1 rounded">GET /api/comments?postId=xxx</code>
              <span className="ml-2">- Get comments</span>
            </li>
            <li>
              <code className="bg-black/30 px-2 py-1 rounded">POST /api/comments</code>
              <span className="ml-2">- Create comment</span>
            </li>
            <li>
              <code className="bg-black/30 px-2 py-1 rounded">POST /api/likes</code>
              <span className="ml-2">- Like/unlike</span>
            </li>
          </ul>
        </div>
        
        <p className="text-gray-400 text-sm mt-8">
          Powered by Next.js + Neon PostgreSQL
        </p>
      </div>
    </main>
  );
}
