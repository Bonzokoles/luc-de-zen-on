import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("📝 Blog Integration API called with:", data);
    
    // Simulate blog post creation
    const blogPostData = {
      key: data.key,
      system: data.system,
      function: data.function,
      timestamp: data.timestamp,
      title: data.title,
      content: data.content,
      tags: data.tags || ["ai", "automation"],
    };

    // Here you would normally call the blog-integration.cjs script
    // For now, we'll simulate the response
    console.log("📝 Creating blog post:", blogPostData);
    
    // Simulate success response
    const response = {
      success: true,
      blogPost: {
        id: Date.now(),
        fileName: `ai-bridge-${
          data.system
        }-${data.key?.toLowerCase()}-${Date.now()}.md`,
        url: `/posts/${data.title?.toLowerCase().replace(/\s+/g, "-")}`,
        ...blogPostData,
      },
      message: "Blog post created successfully",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Blog Integration error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to create blog post",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      name: "MyBonzo Blog Integration API",
      version: "1.0.0",
      status: "active",
      endpoints: {
        POST: "Create blog post from AI function activation",
        GET: "Get API status",
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};