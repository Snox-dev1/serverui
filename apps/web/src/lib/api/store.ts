import { apiRequest } from "@/src/lib/api/client";

export type StoreAction = "install" | "update" | "remove";

export type StoreAppStatus = {
  id: string;
  installed: boolean;
  version?: string;
  /** What the server offers right now; detect-only apps have none. */
  actions: StoreAction[];
};

export type StoreJob = {
  id: string;
  appId: string;
  action: StoreAction;
  state: "running" | "done" | "failed";
  log: string[];
  error?: string;
};

// Detection runs a few commands over SSH, so it gets more room than the default.
const DETECT_TIMEOUT_MS = 40_000;

export async function listStoreApps(serverId: string) {
  const query = new URLSearchParams({ serverId });
  const result = await apiRequest<{ apps: StoreAppStatus[] }>(`/api/store/apps?${query}`, {
    timeoutMs: DETECT_TIMEOUT_MS,
  });
  return result.apps;
}

export function startStoreJob(serverId: string, appId: string, action: StoreAction) {
  return apiRequest<StoreJob>("/api/store/jobs", {
    method: "POST",
    body: JSON.stringify({ serverId, appId, action }),
  });
}

export function getStoreJob(serverId: string, jobId: string) {
  const query = new URLSearchParams({ serverId });
  return apiRequest<StoreJob>(`/api/store/jobs/${encodeURIComponent(jobId)}?${query}`);
}
