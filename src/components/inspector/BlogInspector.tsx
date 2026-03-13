import type { BlogPost } from "@/types/manifest";
import { useProjectStore } from "@stores/projectStore";
import { useState } from "react";
import styles from "./BlogInspector.module.css";
import {
  ImagePickerControl,
  TextAreaControl,
  TextControl,
} from "./controls/Controls";

export function BlogInspector() {
  const manifest = useProjectStore((s) => s.manifest);
  const updateBlogConfig = useProjectStore((s) => s.updateBlogConfig);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  if (!manifest) return null;

  const posts = manifest.blogConfig?.posts ?? [];
  const selectedPost = posts.find((p) => p.id === selectedPostId) ?? null;

  function updatePosts(newPosts: BlogPost[]) {
    updateBlogConfig({ posts: newPosts });
  }

  function addPost() {
    const id = `post_${Date.now().toString(36)}`;
    const count = posts.length + 1;
    const newPost: BlogPost = {
      id,
      slug: `post-${count}`,
      title: `Post ${count}`,
      date: new Date().toISOString().split("T")[0],
      excerpt: "",
      coverImagePath: "",
      components: [],
    };
    updatePosts([...posts, newPost]);
    setSelectedPostId(id);
  }

  function removePost(postId: string) {
    updatePosts(posts.filter((p) => p.id !== postId));
    if (selectedPostId === postId) setSelectedPostId(null);
  }

  function updatePost(postId: string, updates: Partial<BlogPost>) {
    updatePosts(posts.map((p) => (p.id === postId ? { ...p, ...updates } : p)));
  }

  return (
    <div className={styles.inspector}>
      <div className={styles.sectionLabel}>Blog Posts</div>

      {posts.length === 0 ? (
        <div className={styles.emptyHint}>
          No blog posts yet. Add one to get started.
        </div>
      ) : (
        <div className={styles.postList}>
          {posts.map((post) => (
            <div
              key={post.id}
              className={`${styles.postItem} ${
                selectedPostId === post.id ? styles.postItemActive : ""
              }`}
              onClick={() => setSelectedPostId(post.id)}
            >
              <span className={styles.postTitle}>{post.title}</span>
              <span className={styles.postSlug}>/{post.slug}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  removePost(post.id);
                }}
                title="Remove post"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" className={styles.addBtn} onClick={addPost}>
        + Add Post
      </button>

      {selectedPost && (
        <>
          <div className={styles.sectionLabel}>Post Details</div>
          <div className={styles.postFields}>
            <TextControl
              label="Title"
              value={selectedPost.title}
              onChange={(v) => updatePost(selectedPost.id, { title: v })}
            />
            <TextControl
              label="Slug"
              value={selectedPost.slug}
              onChange={(v) => updatePost(selectedPost.id, { slug: v })}
            />
            <TextControl
              label="Date"
              value={selectedPost.date}
              onChange={(v) => updatePost(selectedPost.id, { date: v })}
            />
            <TextAreaControl
              label="Excerpt"
              value={selectedPost.excerpt}
              onChange={(v) => updatePost(selectedPost.id, { excerpt: v })}
            />
            <ImagePickerControl
              label="Cover Image"
              value={selectedPost.coverImagePath}
              onChange={(v) =>
                updatePost(selectedPost.id, { coverImagePath: v })
              }
              category="banners"
            />
          </div>
        </>
      )}
    </div>
  );
}
