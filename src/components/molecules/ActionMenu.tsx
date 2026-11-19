import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../atoms/formFieldStyles";
import { MoreVerticalIcon } from "../icons";

export type ActionMenuItem = {
  icon?: ReactNode;
  label: string;
  /** Leaving this out makes the item only close the menu. */
  onSelect?: () => void;
  tone?: "danger" | "default";
};

type ActionMenuProps = {
  /** Extra classes for the trigger button, e.g. to adjust its spacing. */
  className?: string;
  items: ActionMenuItem[];
  /** Accessible name for the trigger button, e.g. "More actions for Jane". */
  label: string;
};

const MENU_GAP = 6;
const MENU_VIEWPORT_PADDING = 8;

// Just the dots, no circle. Slim side padding keeps the dots close to whatever
// sits beside them, and the ring only shows for keyboard focus.
const triggerClassName =
  "inline-flex cursor-pointer items-center justify-center rounded-md px-1 py-2 text-slate-500 transition-colors hover:text-primary-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20";

const itemToneClassNames = {
  danger: "text-red-600 hover:bg-red-50 focus:bg-red-50",
  default: "text-slate-700 hover:bg-slate-50 focus:bg-slate-50",
};

const getMenuItems = (menu: HTMLElement | null) =>
  Array.from(
    menu?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
  );

// A "more actions" button whose menu renders through a portal, like Tooltip,
// so the table's horizontal scroll container can't clip it.
const ActionMenu = ({ className, items, label }: ActionMenuProps) => {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = (shouldRestoreFocus: boolean) => {
    setIsOpen(false);

    if (shouldRestoreFocus) {
      triggerRef.current?.focus();
    }
  };

  // Placed before paint, so the menu never flashes in the wrong spot. It opens
  // below the trigger, right-aligned with it, or above when it wouldn't fit.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;

    if (!isOpen || !trigger || !menu) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const fitsBelow =
      triggerRect.bottom + MENU_GAP + menuHeight <=
      window.innerHeight - MENU_VIEWPORT_PADDING;
    const top = fitsBelow
      ? triggerRect.bottom + MENU_GAP
      : Math.max(
          MENU_VIEWPORT_PADDING,
          triggerRect.top - MENU_GAP - menuHeight,
        );

    menu.style.top = `${top}px`;
    menu.style.right = `${Math.max(
      MENU_VIEWPORT_PADDING,
      window.innerWidth - triggerRect.right,
    )}px`;
    getMenuItems(menu)[0]?.focus({ preventScroll: true });
  }, [isOpen]);

  // Closes on a click elsewhere, and on scroll or resize, which would leave
  // the menu detached from its row.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        (menuRef.current?.contains(target) ||
          triggerRef.current?.contains(target))
      ) {
        return;
      }

      setIsOpen(false);
    };

    const handleViewportChange = () => setIsOpen(false);

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const menuItems = getMenuItems(menuRef.current);
    const currentIndex = menuItems.findIndex(
      (menuItem) => menuItem === document.activeElement,
    );
    const focusItem = (index: number) => {
      event.preventDefault();
      menuItems[(index + menuItems.length) % menuItems.length]?.focus();
    };

    switch (event.key) {
      case "ArrowDown":
        focusItem(currentIndex + 1);
        break;
      case "ArrowUp":
        focusItem(currentIndex - 1);
        break;
      case "Home":
        focusItem(0);
        break;
      case "End":
        focusItem(menuItems.length - 1);
        break;
      case "Escape":
      case "Tab":
        event.preventDefault();
        closeMenu(true);
        break;
    }
  };

  const handleSelect = (item: ActionMenuItem) => {
    closeMenu(true);
    item.onSelect?.();
  };

  return (
    <>
      <button
        ref={triggerRef}
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={label}
        className={cx(
          triggerClassName,
          isOpen && "text-primary-200",
          className,
        )}
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <MoreVerticalIcon className="h-3.5 w-1" />
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              aria-label={label}
              className="fixed z-60 min-w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-lg shadow-slate-900/10"
              role="menu"
              onKeyDown={handleMenuKeyDown}
            >
              {items.map((item) => (
                <button
                  key={item.label}
                  className={cx(
                    "flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none",
                    itemToneClassNames[item.tone ?? "default"],
                  )}
                  role="menuitem"
                  tabIndex={-1}
                  type="button"
                  onClick={() => handleSelect(item)}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default ActionMenu;
