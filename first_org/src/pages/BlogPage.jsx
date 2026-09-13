
import { useEffect, useState } from "react";
import Footertemp from "../comp/Footertemp.jsx";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

export default function Blog() {
  const [expandedPost, setExpandedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/blog-posts/public`);

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }

        const data = await response.json();

        setBlogPosts(data.blogPosts || []);
      } catch (error) {
        console.error("FETCH BLOG POSTS ERROR:", error);
        setError("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <>
      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <p className="text-gray-500">
                Loading blog posts...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* Blog Content */}
          {!loading && !error && (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
                  Our Blog
                </p>

                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                  Latest News & Insights
                </h2>

                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                  Discover the latest news, insights, projects, and updates
                  from our company.
                </p>
              </div>

              {/* No Posts */}
              {blogPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No blog posts available yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                  {blogPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >

                      {/* Image */}
                      {post.featuredImage ? (
                        <img
                          src={
                            post.featuredImage.startsWith("http")
                              ? post.featuredImage
                              : `${SERVER_URL}${post.featuredImage}`
                          }
                          alt={post.title}
                          className="w-full h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">

                        {/* Date */}
                        {post.publishedAt && (
                          <p className="text-sm text-blue-600 font-medium mb-3">
                            {new Date(
                              post.publishedAt
                            ).toLocaleDateString()}
                          </p>
                        )}

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-gray-600">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Full Content */}
                        {expandedPost === post.id && (
                          <div className="mt-4 border-t border-gray-100 pt-4">
                            <p className="whitespace-pre-line text-gray-700 leading-7">
                              {post.content}
                            </p>
                          </div>
                        )}

                        {/* Read More / Show Less */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedPost(
                              expandedPost === post.id
                                ? null
                                : post.id
                            )
                          }
                          className="mt-5 text-blue-600 font-semibold hover:text-blue-800 transition"
                        >
                          {expandedPost === post.id
                            ? "Show Less ↑"
                            : "Read More →"}
                        </button>

                      </div>
                    </article>
                  ))}

                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* Footer */}
      <Footertemp />
    </>
  );
}

