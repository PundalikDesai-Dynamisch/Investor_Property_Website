import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PostLite } from "@/lib/types";

export function PostCard({ post, large }: { post: PostLite; large?: boolean }) {
  return (
    <article className="group">
      <Link href={`/${post.slug}`} className="block">
        <div className={`relative overflow-hidden rounded-md bg-wash ${large ? "aspect-[16/10]" : "aspect-[3/2]"}`}>
          {post.cover && <Image src={post.cover} alt="" fill sizes={large ? "(min-width:1024px) 720px, 100vw" : "(min-width:1024px) 400px, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
        </div>
        <p className="label mt-4">{post.category}{post.locations[0] ? ` · ${post.locations[0]}` : ""}</p>
        <h3 className={`mt-2 font-display leading-tight underline-offset-4 group-hover:underline ${large ? "text-[2rem]" : "text-[1.4rem]"}`}>{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-[0.9375rem] text-ink-2">{post.excerpt}</p>
        <p className="small mt-3 text-muted"><time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read</p>
      </Link>
    </article>
  );
}
