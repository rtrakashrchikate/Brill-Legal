import { Markdown } from "@/components/Markdown";
import type { Article } from "@/lib/content";

/**
 * Renders an article body in the editorial `.prose` style, switching on source:
 * markdown for in-repo content, WordPress-rendered HTML otherwise.
 */
export function ArticleBody({ article }: { article: Article }) {
  if (article.bodyFormat === "html") {
    return (
      <div
        className="prose max-w-none"
        // Content is authored by trusted editors in WordPress.
        dangerouslySetInnerHTML={{ __html: article.body }}
      />
    );
  }
  return <Markdown>{article.body}</Markdown>;
}
