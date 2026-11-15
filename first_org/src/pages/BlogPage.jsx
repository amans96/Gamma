import { useEffect, useState } from "react";
import { ArrowRight, ChevronUp, FileText, RefreshCw } from "lucide-react";
import Footertemp from "../comp/Footertemp.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const BLOG_CACHE_KEY = "gama_blog_posts_cache";
const CACHE_DURATION = 5 * 60 * 1000;

const getCachedBlogPosts = () => {
  try {
    const cached = localStorage.getItem(BLOG_CACHE_KEY);
    if (!cached) return null;
    const parsedCache = JSON.parse(cached);
    if (!parsedCache || !Array.isArray(parsedCache.blogPosts) || !parsedCache.timestamp) {
      localStorage.removeItem(BLOG_CACHE_KEY);
      return null;
    }
    if (Date.now() - parsedCache.timestamp > CACHE_DURATION) {
      localStorage.removeItem(BLOG_CACHE_KEY);
      return null;
    }
    return parsedCache.blogPosts;
  } catch (error) {
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

export default function Blog() {
  const [expandedPost, setExpandedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        setError("");
        const cached = getCachedBlogPosts();
        if (cached) {
          if (isMounted) {
            setBlogPosts(cached);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setLoading(true);

        const response = await fetch(`${API_URL}/blog/public`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load blog posts");
        }

        const posts = data.blogPosts || [];
        cacheBlogPosts(posts);

        if (isMounted) {
          setBlogPosts(posts);
        }
      } catch (err) {
        try {
          const oldCache = localStorage.getItem(BLOG_CACHE_KEY);
          if (oldCache) {
            const parsed = JSON.parse(oldCache);
            if (parsed && Array.isArray(parsed.blogPosts)) {
              if (isMounted) {
                setBlogPosts(parsed.blogPosts);
                setError("");
              }
              return;
            }
          }
        } catch (_) {}

        if (isMounted) {
          setError(err.message || "Failed to load blog posts");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${BACKEND_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  return (
    <div className="w-full bg-background min-h-screen flex flex-col justify-between">
      <main className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-12 sm:mb-16">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Engineering research & analysis
            </p>
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground">
              Technical publications & grid insights
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Updates on transformer efficiency, harmonic mitigation techniques, and modern electrical safety protocols.
            </p>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-4">
                  <div className="aspect-[16/10] rounded-lg bg-muted" />
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-4/5 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-xl border border-border bg-muted/40 p-10 text-center max-w-md mx-auto">
              <p className="text-sm text-foreground mb-4">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && blogPosts.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center max-w-md mx-auto">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-medium text-foreground mb-1">
                No articles published yet
              </h3>
              <p className="text-xs text-muted-foreground">
                Technical articles and engineering whitepapers will appear here.
              </p>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && blogPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => {
                const isExpanded = expandedPost === post.id;
                return (
                  <article
                    key={post.id}
                    className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between transition-colors hover:border-foreground/20"
                  >
                    <div>
                      {post.featuredImage ? (
                        <div className="aspect-[16/10] w-full bg-muted border-b border-border overflow-hidden">
                          <img
                            src={getImageUrl(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] w-full bg-muted/60 border-b border-border flex items-center justify-center text-muted-foreground">
                          <FileText className="w-8 h-8 opacity-40" />
                        </div>
                      )}

                      <div className="p-5 space-y-3">
                        {post.publishedAt && (
                          <time className="text-[11px] font-mono text-muted-foreground block">
                            {new Date(post.publishedAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        )}

                        <h3 className="text-base font-medium text-foreground tracking-tight leading-snug">
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        {isExpanded && post.content && (
                          <div className="pt-3 border-t border-border/60 text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
                            {post.content}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPost((prev) => (prev === post.id ? null : post.id))
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-foreground/80 transition-colors"
                      >
                        <span>{isExpanded ? "Collapse article" : "Read full article"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footertemp />
    </div>
  );
}
