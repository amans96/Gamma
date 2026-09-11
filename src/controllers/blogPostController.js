
import prisma from "../utils/prisma.js";
import createActivityLog from "../utils/activityLogger.js";

// ==========================================
// CREATE BLOG POST
// ADMIN
// ==========================================

export const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      status,
      publishedAt,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({
        message: "Title, slug and content are required",
      });
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
    });

    if (existingPost) {
      return res.status(409).json({
        message: "A blog post with this slug already exists",
      });
    }

    // Determine published date
    let publishDate = null;

    if (status === "PUBLISHED") {
      publishDate = publishedAt
        ? new Date(publishedAt)
        : new Date();
    }

    // Create blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        status: status || "DRAFT",
        publishedAt: publishDate,
      },
    });
    await createActivityLog({
  req,
  action: "CREATE",
  entity: "BlogPost",
  entityId: blogPost.id,
  details: `Created blog post "${blogPost.title}"`,
});
    


    res.status(201).json({
      message: "Blog post created successfully",
      blogPost,
    });

  } catch (error) {
    console.error("CREATE BLOG POST ERROR:", error);

    res.status(500).json({
      message: "Failed to create blog post",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL BLOG POSTS
// ADMIN
// ==========================================

export const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: blogPosts.length,
      blogPosts,
    });

  } catch (error) {
    console.error("GET BLOG POSTS ERROR:", error);

    res.status(500).json({
      message: "Failed to get blog posts",
      error: error.message,
    });
  }
};


// ==========================================
// GET PUBLISHED BLOG POSTS
// PUBLIC WEBSITE
// ==========================================

export const getPublishedBlogPosts = async (req, res) => {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    res.status(200).json({
      count: blogPosts.length,
      blogPosts,
    });

  } catch (error) {
    console.error("GET PUBLISHED BLOG POSTS ERROR:", error);

    res.status(500).json({
      message: "Failed to get published blog posts",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE BLOG POST
// PUBLIC
// ==========================================

export const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogPost = await prisma.blogPost.findUnique({
      where: {
        id,
      },
    });

    if (!blogPost) {
      return res.status(404).json({
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      blogPost,
    });

  } catch (error) {
    console.error("GET BLOG POST ERROR:", error);

    res.status(500).json({
      message: "Failed to get blog post",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE BLOG POST
// ADMIN
// ==========================================

export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      status,
      publishedAt,
    } = req.body;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: {
        id,
      },
    });

    if (!existingPost) {
      return res.status(404).json({
        message: "Blog post not found",
      });
    }

    // Check slug if it is being changed
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: {
          slug,
        },
      });

      if (slugExists) {
        return res.status(409).json({
          message: "Another blog post already uses this slug",
        });
      }
    }

    // Determine published date
    let newPublishedAt = existingPost.publishedAt;

    if (status === "PUBLISHED") {
      // Keep existing date if already published
      // Otherwise create a new publication date
      newPublishedAt =
        existingPost.status === "PUBLISHED" &&
        existingPost.publishedAt
          ? existingPost.publishedAt
          : publishedAt
            ? new Date(publishedAt)
            : new Date();
    }

    if (status === "DRAFT") {
      newPublishedAt = null;
    }

    // Update blog post
    const blogPost = await prisma.blogPost.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(status !== undefined && { status }),
        ...(status !== undefined && {
          publishedAt: newPublishedAt,
        }),
      },
    });
    await createActivityLog({
  req,
  action: "UPDATE",
  entity: "BlogPost",
  entityId: blogPost.id,
  details: `Updated blog post "${blogPost.title}"`,
});

    res.status(200).json({
      message: "Blog post updated successfully",
      blogPost,
    });

  } catch (error) {
    console.error("UPDATE BLOG POST ERROR:", error);

    res.status(500).json({
      message: "Failed to update blog post",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE BLOG POST
// ADMIN
// ==========================================

export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: {
        id,
      },
    });

    if (!existingPost) {
      return res.status(404).json({
        message: "Blog post not found",
      });
    }

    // Delete blog post
    await prisma.blogPost.delete({
      where: {
        id,
      },
    });
    await createActivityLog({
  req,
  action: "DELETE",
  entity: "BlogPost",
  entityId: existingPost.id,
  details: `Deleted blog post "${existingPost.title}"`,
});

    res.status(200).json({
      message: "Blog post deleted successfully",
    });

  } catch (error) {
    console.error("DELETE BLOG POST ERROR:", error);

    res.status(500).json({
      message: "Failed to delete blog post",
      error: error.message,
    });
  }
};

