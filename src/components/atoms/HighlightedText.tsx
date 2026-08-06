import type { ReactNode } from "react";
import { cx } from "./formFieldStyles";

type HighlightedTextProps = {
  highlightClassName?: string;
  query?: string;
  text: string;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSearchTokens = (query: string | undefined) =>
  (query ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort((firstToken, secondToken) => secondToken.length - firstToken.length);

const HighlightedText = ({
  highlightClassName,
  query,
  text,
}: HighlightedTextProps) => {
  const tokens = getSearchTokens(query);

  if (tokens.length === 0 || !text) {
    return <>{text}</>;
  }

  const tokenPattern = tokens.map(escapeRegExp).join("|");
  const searchRegex = new RegExp(`(${tokenPattern})`, "gi");
  const parts = text.split(searchRegex);

  return (
    <>
      {parts.map((part, index): ReactNode => {
        if (!part) {
          return null;
        }

        const isMatch = tokens.some(
          (token) => token.toLowerCase() === part.toLowerCase(),
        );

        return isMatch ? (
          <mark
            key={`${part}-${index}`}
            className={cx(
              "rounded bg-amber-200/80 px-0.5 text-slate-950",
              highlightClassName,
            )}
          >
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </>
  );
};

export default HighlightedText;
