import { mdxAnnotations } from 'mdx-annotations';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

export const remarkPlugins = [
    mdxAnnotations.remark,
    remarkFrontmatter,
    remarkMdxFrontmatter,
];
