import type {
  ApiResponse,
  DashboardStats,
  DecryptionResult,
  EncryptionResult,
  OperationRecord,
} from "@/types";

interface ApiErrorBody {
  message?: string;
  detail?: string;
}

interface HistoryPage {
  items: OperationRecord[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface HistoryOptions {
  page?: number;
  limit?: number;
  operation?: string;
  status?: string;
  search?: string;
}

interface PasswordStrength {
  score: number;
  level: string;
  suggestions: string[];
}

export interface MatrixValidationResult {
  is_valid: boolean;
  determinant: number;
  is_coprime_256: boolean;
  det_modular_inverse: number | null;
  inverse_matrix: number[][] | null;
  explanation: string;
}

async function requestData<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, init);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not reach the SecureVault API (${errorMsg}). Make sure the backend is running via ./start.sh.`
    );
  }

  const body = await response.json().catch(() => null) as
    | (Partial<ApiResponse<T>> & ApiErrorBody)
    | null;

  if (!response.ok || !body?.success) {
    throw new Error(
      body?.message || body?.detail || `Request failed with status ${response.status}.`
    );
  }

  if (body.data === undefined) {
    throw new Error("The server response did not include data.");
  }

  return body.data;
}

export function encryptFileApi(
  file: File,
  password: string,
  customMatrix?: number[][]
): Promise<EncryptionResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("password", password);
  if (customMatrix) form.append("custom_matrix", JSON.stringify(customMatrix));
  return requestData("/api/encrypt", { method: "POST", body: form });
}

export function decryptFileApi(file: File, password: string): Promise<DecryptionResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("password", password);
  return requestData("/api/decrypt", { method: "POST", body: form });
}

export function checkPasswordStrength(password: string): Promise<PasswordStrength> {
  return requestData("/api/crypto/password-strength", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export function validateMatrixApi(matrix: number[][]): Promise<MatrixValidationResult> {
  return requestData("/api/crypto/validate-matrix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matrix }),
  });
}

export function fetchStats(): Promise<DashboardStats> {
  return requestData("/api/stats");
}

export function fetchHistory(options: HistoryOptions = {}): Promise<HistoryPage> {
  const params = new URLSearchParams({
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 10),
  });
  if (options.operation && options.operation !== "ALL") {
    params.set("operation", options.operation);
  }
  if (options.status && options.status !== "ALL") {
    params.set("status", options.status);
  }
  if (options.search) params.set("search", options.search);
  return requestData(`/api/history?${params.toString()}`);
}

export function getDownloadUrl(operationId: string): string {
  return `/api/download/${encodeURIComponent(operationId)}`;
}