import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/sections/Footer";

type Post = { title: string; content: string; cover_url: string | null; excerpt: string | null; created_at: string };

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title,content,cover_url,excerpt,created_at")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      setPost(data as any);
      if (data) document.title = `${(data as any).title} — Blog`;
      setLoading(false);
    })();
  }, [slug]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <article className="container max-w-3xl pt-32 pb-24">
        <Link to="/#blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !post ? (
          <p className="text-muted-foreground">Post not found.</p>
        ) : (
          <>
            {post.cover_url && (
              <img src={post.cover_url} alt={post.title} className="w-full aspect-video object-cover rounded-3xl mb-8 glass-strong" />
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-muted-foreground mb-8">{post.excerpt}</p>}
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {post.content}
            </div>
          </>
        )}
      </article>
      <Footer />
    </main>
  );
}