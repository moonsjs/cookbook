import { notFound, useLoaderData, type LoaderArgs } from "@moonsjs/react";
import { POSTS, postBySlug } from "../../shared/posts";

/** D.5: dynamic + `prerender` WAJIB `paths`. */
export const prerender = true;
export const paths = () => POSTS.map((post) => ({ slug: post.slug }));

export const loader = async ({ params }: LoaderArgs<"/blog/[slug]">) => {
  const post = postBySlug(params.slug);
  if (post === undefined) {
    notFound();
  }
  return { title: post.title, body: post.body };
};

export default function BlogPost() {
  const data = useLoaderData<typeof loader>();
  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </article>
  );
}
