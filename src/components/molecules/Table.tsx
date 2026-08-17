import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Button from "../atoms/Button";
import HighlightedText from "../atoms/HighlightedText";
import { cx } from "../atoms/formFieldStyles";
import { SortIcon } from "../icons";
import TableActiveControls from "./table/TableActiveControls";
import TableColumnControls from "./table/TableColumnControls";
import TableFilterControls from "./table/TableFilterControls";
import TableHeaderCell from "./table/TableHeaderCell";
import TableSearchControl from "./table/TableSearchControl";
import type {
  SortState,
  TableActionsColumn,
  TableColumn,
  TableDateRangeFilterValue,
  TableFilterState,
  TableFilterStateValue,
  TableRenderContext,
  TableSearchValue,
  TableToolbarDensity,
} from "./table/tableTypes";
import {
  compareSortValues,
  doesRowMatchFilter,
  getActiveFilterCount,
  getActiveFilterSummaries,
  getDefaultHiddenColumnKeys,
  getDefaultSearchStringValue,
  getFilterStringValue,
  getSearchStringValue,
  getSelectFilterOptionsByColumnKey,
  getStoredHiddenColumnKeys,
  hasColumnFilter,
  isColumnSortable,
  isDateRangeFilterValue,
  isFilterValueActive,
  stickyActionsCellClassName,
  stickyActionsHeaderClassName,
  stickyActionsShadowClassName,
  tableControlButtonClassName,
  EXPANDED_SEARCH_WIDTH,
  ICON_ONLY_BUTTON_WIDTH,
  TABLE_SEARCH_ATTRIBUTE,
  TOOLBAR_GAP,
} from "./table/tableUtils";

export type {
  TableActionsColumn,
  TableColumn,
  TableRenderContext,
  TableSortValue,
} from "./table/tableTypes";

type TableProps<Row> = {
  actionsColumn?: TableActionsColumn<Row>;
  className?: string;
  columns: Array<TableColumn<Row>>;
  columnVisibilityStorageKey?: string;
  emptyMessage?: string;
  errorMessage?: string;
  getRowKey: (row: Row, index: number) => string;
  isLoading?: boolean;
  loadingMessage?: string;
  minWidthClassName?: string;
  rows: Row[];
  searchPlaceholder?: string;
  searchValue?: (row: Row) => TableSearchValue;
  shortTitle?: ReactNode;
  subtitle?: ReactNode;
  title?: ReactNode;
};

const Table = <Row,>({
  actionsColumn,
  className,
  columns,
  columnVisibilityStorageKey,
  emptyMessage = "No records found.",
  errorMessage = "",
  getRowKey,
  isLoading = false,
  loadingMessage = "Loading...",
  minWidthClassName = "min-w-full",
  rows,
  searchPlaceholder = "Search table...",
  searchValue,
  shortTitle,
  subtitle,
  title,
}: TableProps<Row>) => {
  const columnControlsId = useId();
  const columnControlsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const labeledControlsWidthRef = useRef(0);
  const longTitleWidthRef = useRef(0);
  const toolbarDensityRef = useRef<TableToolbarDensity>("full");
  const [toolbarDensity, setToolbarDensity] =
    useState<TableToolbarDensity>("full");
  const filterControlsId = useId();
  const filterControlsRef = useRef<HTMLDivElement>(null);
  const searchInputId = useId();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrollableColumns, setHasScrollableColumns] = useState(false);
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>(
    () =>
      getStoredHiddenColumnKeys(columnVisibilityStorageKey) ??
      getDefaultHiddenColumnKeys(columns),
  );
  const [filters, setFilters] = useState<TableFilterState>({});
  const [isColumnPanelOpen, setIsColumnPanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<SortState>(null);

  const hiddenColumnKeySet = useMemo(
    () => new Set(hiddenColumnKeys),
    [hiddenColumnKeys],
  );
  const hideableColumns = useMemo(
    () => columns.filter((column) => column.isHideable !== false),
    [columns],
  );
  const visibleColumns = useMemo(() => {
    const nextVisibleColumns = columns.filter(
      (column) =>
        column.isHideable === false || !hiddenColumnKeySet.has(column.key),
    );

    return nextVisibleColumns.length > 0 ? nextVisibleColumns : columns;
  }, [columns, hiddenColumnKeySet]);
  const sortableColumnByKey = useMemo(
    () =>
      new Map(
        columns.filter(isColumnSortable).map((column) => [column.key, column]),
      ),
    [columns],
  );
  const filterableColumns = useMemo(
    () => columns.filter(hasColumnFilter),
    [columns],
  );
  const filterableColumnByKey = useMemo(
    () => new Map(filterableColumns.map((column) => [column.key, column])),
    [filterableColumns],
  );
  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters),
    [filters],
  );
  const hasActiveFilters = activeFilterCount > 0;
  const trimmedSearchQuery = searchQuery.trim();
  const normalizedSearchQuery = trimmedSearchQuery.toLowerCase();
  const hasActiveSearch = normalizedSearchQuery.length > 0;
  const shouldShowSearchControl =
    Boolean(searchValue) ||
    columns.some((column) => column.filter || column.sortValue);
  const renderContext = useMemo<TableRenderContext>(
    () => ({
      highlightSearchText: (value) => (
        <HighlightedText
          query={trimmedSearchQuery}
          text={getFilterStringValue(value)}
        />
      ),
      searchQuery: trimmedSearchQuery,
    }),
    [trimmedSearchQuery],
  );
  const searchedRows = useMemo(() => {
    if (!hasActiveSearch) {
      return rows;
    }

    return rows.filter((row) => {
      const rowSearchValue = searchValue
        ? getSearchStringValue(searchValue(row))
        : getDefaultSearchStringValue(row, columns);

      return rowSearchValue.includes(normalizedSearchQuery);
    });
  }, [columns, hasActiveSearch, normalizedSearchQuery, rows, searchValue]);
  const filteredRows = useMemo(() => {
    if (!hasActiveFilters) {
      return searchedRows;
    }

    return searchedRows.filter((row) =>
      Object.entries(filters).every(([columnKey, filterValue]) => {
        const column = filterableColumnByKey.get(columnKey);

        return column ? doesRowMatchFilter(row, column, filterValue) : true;
      }),
    );
  }, [filterableColumnByKey, filters, hasActiveFilters, searchedRows]);
  const sortedRows = useMemo(() => {
    if (!isSortingEnabled || !sortState) {
      return filteredRows;
    }

    const sortColumn = sortableColumnByKey.get(sortState.columnKey);

    if (!sortColumn?.sortValue) {
      return filteredRows;
    }

    return filteredRows
      .map((row, index) => ({ index, row }))
      .sort((firstRow, secondRow) => {
        const comparison = compareSortValues(
          sortColumn.sortValue?.(firstRow.row),
          sortColumn.sortValue?.(secondRow.row),
        );

        if (comparison === 0) {
          return firstRow.index - secondRow.index;
        }

        return sortState.direction === "asc" ? comparison : -comparison;
      })
      .map(({ row }) => row);
  }, [filteredRows, isSortingEnabled, sortState, sortableColumnByKey]);
  const selectFilterOptionsByColumnKey = useMemo(
    () => getSelectFilterOptionsByColumnKey(filterableColumns, rows),
    [filterableColumns, rows],
  );
  const activeFilterSummaries = useMemo(
    () =>
      getActiveFilterSummaries(
        filterableColumns,
        filters,
        selectFilterOptionsByColumnKey,
      ),
    [filterableColumns, filters, selectFilterOptionsByColumnKey],
  );

  const hasHeader = Boolean(title || subtitle);
  const isToolbarIconOnly =
    toolbarDensity === "iconsOnly" || toolbarDensity === "shortTitle";
  const shouldShowTable =
    !isLoading && !errorMessage && filteredRows.length > 0;
  const shouldShowColumnControls = hideableColumns.length > 1;
  const shouldShowFilterControls = filterableColumns.length > 0;
  const shouldShowSortControls = sortableColumnByKey.size > 0;
  const shouldShowToolbar =
    shouldShowColumnControls ||
    shouldShowFilterControls ||
    shouldShowSearchControl ||
    shouldShowSortControls;

  // Collapse the search field to its icon exactly when the expanded field would
  // no longer fit beside the title and the other controls, instead of at a fixed
  // breakpoint. The space is measured against the header row rather than the
  // toolbar's own width, because below `sm` the toolbar drops onto its own line
  // and would otherwise always look roomy enough to re-expand. The requirement
  // is always computed as if the field were expanded, so the result never
  // depends on the current state and cannot oscillate.
  useEffect(() => {
    const header = headerRef.current;
    const toolbar = toolbarRef.current;

    if (!header || !toolbar || typeof ResizeObserver === "undefined") {
      return;
    }

    const measureToolbar = () => {
      const searchElement = toolbar.querySelector(
        `[${TABLE_SEARCH_ATTRIBUTE}]`,
      );
      const controls = Array.from(toolbar.children);
      const otherControls = controls.filter(
        (control) => control !== searchElement,
      );
      const gapsWidth = TOOLBAR_GAP * Math.max(0, controls.length - 1);

      // Only trust live measurements of the parts that are still rendered in
      // their wide form. Once the labels are dropped or the title is shortened,
      // their measured width says nothing about how much room restoring them
      // would need, so the last wide measurement is reused instead.
      if (
        toolbarDensityRef.current === "full" ||
        toolbarDensityRef.current === "compactSearch"
      ) {
        labeledControlsWidthRef.current = otherControls.reduce(
          (total, control) => total + control.getBoundingClientRect().width,
          0,
        );
      }

      if (toolbarDensityRef.current !== "shortTitle") {
        longTitleWidthRef.current =
          titleRef.current?.getBoundingClientRect().width ?? 0;
      }

      const headerStyle = window.getComputedStyle(header);
      // Always measured against the long title, so the decision stays the same
      // whichever title is currently on screen.
      const availableWidth =
        header.clientWidth -
        parseFloat(headerStyle.paddingLeft) -
        parseFloat(headerStyle.paddingRight) -
        longTitleWidthRef.current -
        TOOLBAR_GAP;
      const labeledControlsWidth = labeledControlsWidthRef.current;
      const searchIconWidth = searchElement ? ICON_ONLY_BUTTON_WIDTH : 0;
      const expandedSearchWidth = searchElement ? EXPANDED_SEARCH_WIDTH : 0;
      const iconsOnlyWidth =
        ICON_ONLY_BUTTON_WIDTH * controls.length + gapsWidth;
      const nextDensity: TableToolbarDensity =
        availableWidth >= expandedSearchWidth + labeledControlsWidth + gapsWidth
          ? "full"
          : availableWidth >= searchIconWidth + labeledControlsWidth + gapsWidth
            ? "compactSearch"
            : availableWidth >= iconsOnlyWidth
              ? "iconsOnly"
              : "shortTitle";

      toolbarDensityRef.current = nextDensity;
      setToolbarDensity(nextDensity);
    };

    measureToolbar();

    const observer = new ResizeObserver(measureToolbar);

    observer.observe(header);

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, [shouldShowSearchControl, shouldShowToolbar]);

  useEffect(() => {
    if (!columnVisibilityStorageKey || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      columnVisibilityStorageKey,
      JSON.stringify(hiddenColumnKeys),
    );
  }, [columnVisibilityStorageKey, hiddenColumnKeys]);

  // Keep the pinned actions column's edge shadow in sync with how much of the
  // table is still hidden to its right.
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!actionsColumn || !scrollContainer) {
      return;
    }

    const updateScrollableColumns = () => {
      const remainingScroll =
        scrollContainer.scrollWidth -
        scrollContainer.clientWidth -
        scrollContainer.scrollLeft;

      setHasScrollableColumns(remainingScroll > 1);
    };

    updateScrollableColumns();

    const resizeObserver = new ResizeObserver(updateScrollableColumns);
    resizeObserver.observe(scrollContainer);
    scrollContainer.addEventListener("scroll", updateScrollableColumns, {
      passive: true,
    });

    return () => {
      resizeObserver.disconnect();
      scrollContainer.removeEventListener("scroll", updateScrollableColumns);
    };
  }, [actionsColumn, shouldShowTable, visibleColumns]);

  useEffect(() => {
    if (!isColumnPanelOpen && !isFilterPanelOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      if (
        isColumnPanelOpen &&
        !columnControlsRef.current?.contains(event.target)
      ) {
        setIsColumnPanelOpen(false);
      }

      if (
        isFilterPanelOpen &&
        !filterControlsRef.current?.contains(event.target)
      ) {
        setIsFilterPanelOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsColumnPanelOpen(false);
        setIsFilterPanelOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isColumnPanelOpen, isFilterPanelOpen]);

  const updateFilter = (
    columnKey: string,
    filterValue: TableFilterStateValue | undefined,
  ) => {
    setFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };

      if (isFilterValueActive(filterValue)) {
        nextFilters[columnKey] = filterValue;
      } else {
        delete nextFilters[columnKey];
      }

      return nextFilters;
    });
  };

  const updateDateRangeFilter = (
    columnKey: string,
    field: keyof TableDateRangeFilterValue,
    value: string,
  ) => {
    setFilters((currentFilters) => {
      const currentFilterValue = currentFilters[columnKey];
      const currentDateRangeFilter = isDateRangeFilterValue(currentFilterValue)
        ? currentFilterValue
        : {};
      const nextDateRangeFilter = {
        ...currentDateRangeFilter,
        [field]: value,
      };
      const nextFilters = { ...currentFilters };

      if (isFilterValueActive(nextDateRangeFilter)) {
        nextFilters[columnKey] = nextDateRangeFilter;
      } else {
        delete nextFilters[columnKey];
      }

      return nextFilters;
    });
  };

  const clearFilter = (columnKey: string) => {
    setFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };
      delete nextFilters[columnKey];
      return nextFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearSearchAndFilters = () => {
    setSearchQuery("");
    setFilters({});
  };

  const toggleColumnVisibility = (columnKey: string) => {
    // Pinned columns are rendered as disabled checkboxes, so this is a guard.
    if (
      columns.find((column) => column.key === columnKey)?.isHideable === false
    ) {
      return;
    }

    if (
      sortState?.columnKey === columnKey &&
      !hiddenColumnKeySet.has(columnKey)
    ) {
      setSortState(null);
    }

    setHiddenColumnKeys((currentHiddenColumnKeys) => {
      if (currentHiddenColumnKeys.includes(columnKey)) {
        return currentHiddenColumnKeys.filter((key) => key !== columnKey);
      }

      const visibleHideableColumnCount = hideableColumns.filter(
        (column) => !currentHiddenColumnKeys.includes(column.key),
      ).length;

      if (visibleHideableColumnCount <= 1) {
        return currentHiddenColumnKeys;
      }

      return [...currentHiddenColumnKeys, columnKey];
    });
  };

  const toggleColumnSort = (columnKey: string) => {
    setSortState((currentSortState) => {
      if (currentSortState?.columnKey !== columnKey) {
        return { columnKey, direction: "asc" };
      }

      if (currentSortState.direction === "asc") {
        return { columnKey, direction: "desc" };
      }

      return null;
    });
  };

  const toggleSorting = () => {
    if (isSortingEnabled) {
      setSortState(null);
    }

    setIsSortingEnabled((currentValue) => !currentValue);
  };

  return (
    <section
      className={cx(
        "overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5",
        className,
      )}
    >
      {hasHeader ? (
        <div
          ref={headerRef}
          className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4"
        >
          <div ref={titleRef}>
            {title ? (
              <h2 className="text-lg font-bold text-slate-950">
                {toolbarDensity === "shortTitle" && shortTitle
                  ? shortTitle
                  : title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>
          {shouldShowToolbar ? (
            <div
              ref={toolbarRef}
              className="ml-auto flex flex-wrap items-center justify-end gap-2"
            >
              {shouldShowSearchControl ? (
                <TableSearchControl
                  hasActiveSearch={hasActiveSearch}
                  inputId={searchInputId}
                  isCompact={toolbarDensity !== "full"}
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={clearSearch}
                />
              ) : null}

              {shouldShowFilterControls ? (
                <TableFilterControls
                  activeFilterCount={activeFilterCount}
                  containerRef={filterControlsRef}
                  filteredRowCount={filteredRows.length}
                  filters={filters}
                  hasActiveFilters={hasActiveFilters}
                  isIconOnly={isToolbarIconOnly}
                  isOpen={isFilterPanelOpen}
                  panelId={filterControlsId}
                  rowsCount={rows.length}
                  selectFilterOptionsByColumnKey={
                    selectFilterOptionsByColumnKey
                  }
                  tableColumns={filterableColumns}
                  onClearFilters={clearFilters}
                  onDateRangeFilterChange={updateDateRangeFilter}
                  onTextFilterChange={updateFilter}
                  onToggle={() => {
                    setIsColumnPanelOpen(false);
                    setIsFilterPanelOpen((currentValue) => !currentValue);
                  }}
                />
              ) : null}

              {shouldShowSortControls ? (
                <Button
                  aria-label={isToolbarIconOnly ? "Sort" : undefined}
                  aria-pressed={isSortingEnabled}
                  className={cx(
                    tableControlButtonClassName,
                    isSortingEnabled &&
                      "!border-primary-200 !bg-primary-200 !text-white hover:!bg-primary-300 hover:!text-white",
                  )}
                  size="sm"
                  type="button"
                  variant="link"
                  onClick={toggleSorting}
                >
                  <SortIcon />
                  {isToolbarIconOnly ? null : "Sort"}
                </Button>
              ) : null}

              {shouldShowColumnControls ? (
                <TableColumnControls
                  containerRef={columnControlsRef}
                  hiddenColumnKeySet={hiddenColumnKeySet}
                  isIconOnly={isToolbarIconOnly}
                  isOpen={isColumnPanelOpen}
                  panelId={columnControlsId}
                  tableColumns={columns}
                  onResetColumns={() =>
                    setHiddenColumnKeys(getDefaultHiddenColumnKeys(columns))
                  }
                  onToggle={() => {
                    setIsFilterPanelOpen(false);
                    setIsColumnPanelOpen((currentValue) => !currentValue);
                  }}
                  onToggleColumnVisibility={toggleColumnVisibility}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <TableActiveControls
        activeFilterSummaries={activeFilterSummaries}
        filteredRowCount={filteredRows.length}
        hasActiveFilters={hasActiveFilters}
        hasActiveSearch={hasActiveSearch}
        rowsCount={rows.length}
        searchQuery={searchQuery}
        onClearAll={clearSearchAndFilters}
        onClearFilter={clearFilter}
        onClearSearch={clearSearch}
      />

      {isLoading ? (
        <p className="px-5 py-8 text-sm text-slate-500">{loadingMessage}</p>
      ) : null}

      {!isLoading && errorMessage ? (
        <p
          role="alert"
          className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !errorMessage && filteredRows.length === 0 ? (
        <p className="px-5 py-8 text-sm text-slate-500">
          {(hasActiveFilters || hasActiveSearch) && rows.length > 0
            ? "No records match the active search or filters."
            : emptyMessage}
        </p>
      ) : null}

      {shouldShowTable ? (
        <div ref={scrollContainerRef} className="overflow-x-auto rounded-b-xl">
          <table
            className={cx(
              minWidthClassName,
              "divide-y divide-slate-100 text-left text-sm",
            )}
          >
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                {visibleColumns.map((column) => (
                  <TableHeaderCell
                    key={column.key}
                    column={column}
                    isSortingEnabled={isSortingEnabled}
                    sortDirection={
                      sortState?.columnKey === column.key
                        ? sortState.direction
                        : undefined
                    }
                    onToggleSort={toggleColumnSort}
                  />
                ))}

                {actionsColumn ? (
                  <th
                    scope="col"
                    className={cx(
                      stickyActionsHeaderClassName,
                      hasScrollableColumns && stickyActionsShadowClassName,
                      actionsColumn.headerClassName,
                    )}
                  >
                    {actionsColumn.header ?? (
                      <span className="sr-only">Actions</span>
                    )}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRows.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className="group align-top transition-colors hover:bg-slate-50/70"
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={cx("px-4 py-4", column.cellClassName)}
                    >
                      {column.render(row, renderContext)}
                    </td>
                  ))}

                  {actionsColumn ? (
                    <td
                      className={cx(
                        stickyActionsCellClassName,
                        // The pinned cell paints over the row, so it repeats the
                        // row's hover state itself, a step darker than its tint.
                        "transition-colors group-hover:bg-slate-100",
                        hasScrollableColumns && stickyActionsShadowClassName,
                        actionsColumn.cellClassName,
                      )}
                    >
                      {actionsColumn.render(row, renderContext)}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
};

export default Table;
