import type { JSX } from "react";
import "./DecoratedList.css";

/** Interface for a single list item */
interface ListItem {
  /** The title for the list item */
  title: string;
  /** The description text for the list item */
  description: string;
  /** Whether to show the bullet dot */
  showBulletDot?: boolean;
}

/** Props for the decorated list component */
interface DecoratedListProps {
  /** Array of list items with titles and descriptions */
  items: ListItem[];
}

/**
 * DecoratedList component.
 * This component renders a styled list where each item has a title and a description.
 *
 * @param {DecoratedListProps} props - The properties for the decorated list component
 * @returns {JSX.Element} The rendered decorated list component
 */
export default function DecoratedList({ items }: DecoratedListProps): JSX.Element {
  return (
    <ul className="decorated-list decorated-list-component">
      {items.map((item, index) => (
        <li key={index}>
          <h3>
            {item.showBulletDot ? "•" : null} {item.title}
          </h3>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
