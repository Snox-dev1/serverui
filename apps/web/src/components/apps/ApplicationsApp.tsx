"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  filterStoreApps,
  STORE_CATALOG,
  STORE_CATEGORIES,
  type StoreApp,
  type StoreCategory,
} from "@/src/data/store-catalog";
import { useSelectedServer } from "@/src/lib/session";

type Filter = StoreCategory | "All";

export function ApplicationsApp() {
  const server = useSelectedServer();
  const [category, setCategory] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => filterStoreApps(STORE_CATALOG, category, query), [category, query]);

  return (
    <div className="flex h-full min-h-0 overflow-hidden sui-app">
      <aside className="sui-sidebar flex w-[176px] shrink-0 flex-col gap-0.5 px-3 py-4 text-[13px]">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] sui-muted">
          Store
        </p>
        {(["All", ...STORE_CATEGORIES] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-current={category === item ? "page" : undefined}
            className={`rounded-md px-2 py-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              category === item ? "sui-selected" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-6 py-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-semibold tracking-tight sui-title">
              {category === "All" ? "Discover" : category}
            </h3>
            <p className="mt-1 truncate text-[13px] sui-muted">
              Install on {server?.name || "the selected server"}
            </p>
          </div>
          <label className="sui-input flex w-52 shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] focus-within:ring-2 focus-within:ring-sky-400">
            <Search className="size-3.5 shrink-0 sui-muted" aria-hidden />
            <input
              type="search"
              aria-label="Search apps"
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent outline-none"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="mt-16 text-center text-[13px] sui-muted">No app matches “{query.trim()}”</p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-3 xl:grid-cols-2">
            {visible.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function AppCard({ app }: { app: StoreApp }) {
  const Icon = app.icon;
  return (
    <li className="sui-card flex items-start gap-3.5 rounded-[14px] p-4">
      <div
        className={`grid size-12 shrink-0 place-items-center rounded-[11px] bg-gradient-to-br text-white shadow-sm ${app.tint}`}
      >
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold sui-title">{app.name}</h4>
        <p className="mt-0.5 text-[12.5px] leading-5 sui-muted">{app.tagline}</p>
        <p className="mt-2 text-[11px] sui-muted">{app.footprint}</p>
      </div>
      {/* Installation is wired in the next step; the catalogue ships first. */}
      <button
        type="button"
        disabled
        title="Installation is coming next"
        className="shrink-0 rounded-full bg-sky-500 px-3.5 py-1 text-[12px] font-semibold text-white disabled:opacity-50"
      >
        Get
      </button>
    </li>
  );
}
