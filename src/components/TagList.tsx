interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags.length) return null;
  return (
    <ul dir="ltr" className="flex flex-wrap gap-1.5 rtl:justify-end">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-[12.5px] text-[var(--color-ink-secondary)]"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
