import { useEffect, useState } from "react";
import Footertemp from "../comp/Footertemp.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

// ==========================================
// CACHE SETTINGS
// ==========================================

const BLOG_CACHE_KEY = "gama_blog_posts_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ==========================================
// CACHE HELPERS
// ==========================================

const getCachedBlogPosts = () => {
  try {
    const cached = localStorage.getItem(BLOG_CACHE_KEY);

    if (!cached) {
      return null;
    }

    const parsedCache = JSON.parse(cached);

    if (
      !parsedCache ||
      !Array.isArray(parsedCache.blogPosts) ||
      !parsedCache.timestamp
    ) {
      localStorage.removeItem(BLOG_CACHE_KEY);
      return null;
    }

    const cacheAge = Date.now() - parsedCache.timestamp;

    // Cache expired
    if (cacheAge > CACHE_DURATION) {
      localStorage.removeItem(BLOG_CACHE_KEY);
      return null;
    }

    return parsedCache.blogPosts;
  } catch (error) {
    console.error("BLOG CACHE READ ERROR:", error);

    localStorage.removeItem(BLOG_CACHE_KEY);

    return null;
  }
};

const cacheBlogPosts = (blogPosts) => {
  try {
    localStorage.setItem(
      BLOG_CACHE_KEY,
      JSON.stringify({
        blogPosts,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("BLOG CACHE WRITE ERROR:", error);
  }
};

// ==========================================
// COMPONENT
// ==========================================

export default function Blog() {
  const [expandedPost, setExpandedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH BLOG POSTS
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchBlogPosts = async () => {
      try {
        setError("");

        // ==========================================
        // CHECK CACHE FIRST
        // ==========================================

        const cachedPosts = getCachedBlogPosts();

        if (cachedPosts) {
          console.log("BLOG: Using cached data");

          if (isMounted) {
            setBlogPosts(cachedPosts);
            setLoading(false);
          }

          return;
        }

        // ==========================================
        // NO CACHE - FETCH FROM API
        // ==========================================

        console.log("BLOG: Fetching from API");

        if (isMounted) {
          setLoading(true);
        }

       const response = await fetch(
  `${API_URL}/blog-posts/public`
);

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message || `Failed to fetch blog posts (${response.status})`
  );
}

      

        const fetchedPosts = data.blogPosts || [];

        // ==========================================
        // SAVE TO CACHE
        // ==========================================

        cacheBlogPosts(fetchedPosts);

        if (isMounted) {
          setBlogPosts(fetchedPosts);
        }
      } catch (error) {
        console.error("FETCH BLOG POSTS ERROR:", error);

        // ==========================================
        // FALLBACK TO OLD CACHE
        // ==========================================

        try {
          const oldCache = localStorage.getItem(
            BLOG_CACHE_KEY
          );

          if (oldCache) {
            const parsedCache = JSON.parse(oldCache);

            if (
              parsedCache &&
              Array.isArray(parsedCache.blogPosts)
            ) {
              console.log(
                "BLOG: API failed, using old cached data"
              );

              if (isMounted) {
                setBlogPosts(parsedCache.blogPosts);
                setError("");
              }

              return;
            }
          }
        } catch (cacheError) {
          console.error(
            "BLOG FALLBACK CACHE ERROR:",
            cacheError
          );
        }

        if (isMounted) {
          setError("Failed to load blog posts.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    return `${BACKEND_URL}/${image}`;
  };

  // ==========================================
  // UI
  // ==========================================

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
                  Discover the latest news, insights, projects, and
                  updates from our company.
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
                          src={getImageUrl(post.featuredImage)}
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