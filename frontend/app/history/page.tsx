"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, FileText, Lock, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { HistoryTable } from "@/components/HistoryTable";
import { fetchHistory } from "@/lib/api";
import { OperationRecord } from "@/types";

export default function HistoryPage() {
  const [items, setItems] = useState<OperationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [operationFilter, setOperationFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (
    targetPage = page,
    op = operationFilter,
    stat = statusFilter,
    query = search
  ) => {
    setIsLoading(true);
    try {
      const res = await fetchHistory({
        page: targetPage,
        limit: 10,
        operation: op,
        status: stat,
        search: query || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
      setPage(res.page);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchHistory({ page: 1, limit: 10 })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
        setPage(res.page);
        setTotalPages(res.total_pages);
      })
      .catch((err: unknown) => console.error("Failed to load history:", err))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(1, operationFilter, statusFilter, search);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Operation History</h1>
          <p className="text-sm text-slate-400">
            Immutable audit record of all cryptographic transformations and integrity checks.
          </p>
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => loadData()}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
        >
          Refresh Log
        </GlassButton>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by filename or hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
            />
          </form>

          {/* Operation Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            {["ALL", "ENCRYPT", "DECRYPT"].map((op) => (
              <button
                key={op}
                onClick={() => {
                  setOperationFilter(op);
                  loadData(1, op, statusFilter, search);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  operationFilter === op
                    ? "bg-white/10 text-white shadow-sm border border-white/15"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {op === "ALL" ? "All Operations" : op}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            {["ALL", "SUCCESS", "FAILED"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  loadData(1, operationFilter, st, search);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === st
                    ? "bg-white/10 text-white shadow-sm border border-white/15"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st === "ALL" ? "All Status" : st}
              </button>
            ))}
          </div>

        </div>
      </GlassCard>

      {/* Table Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Found {total} recorded operations</span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>

        <HistoryTable items={items} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <GlassButton
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => loadData(page - 1)}
            >
              Previous
            </GlassButton>

            <span className="text-xs text-slate-400 px-3">
              {page} / {totalPages}
            </span>

            <GlassButton
              variant="secondary"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => loadData(page + 1)}
            >
              Next
            </GlassButton>
          </div>
        )}
      </div>
    </div>
  );
}
