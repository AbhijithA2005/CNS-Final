export interface OperationRecord {
  id: string;
  original_filename: string;
  stored_filename: string;
  operation: "ENCRYPT" | "DECRYPT";
  original_size: number;
  output_size: number;
  algorithm: string;
  status: "SUCCESS" | "FAILED";
  created_at: string;
  error_message?: string | null;
  sha256?: string | null;
}

export interface DashboardStats {
  files_processed: number;
  encrypted_count: number;
  decrypted_count: number;
  total_storage_bytes: number;
}

export interface HillMetadata {
  dimension: number;
  matrix: number[][];
  determinant: number;
  is_coprime_256: boolean;
  det_modular_inverse: number | null;
  inverse_matrix: number[][] | null;
  modulus: number;
  formula: string;
  decrypt_formula: string;
}

export interface DESMetadata {
  algorithm: string;
  mode: string;
  block_size_bytes: number;
  block_size_bits: number;
  key_size_bytes: number;
  effective_key_bits: number;
  parity_bits: number;
  padding_standard: string;
  security_advisory: string;
}

export interface PipelineStage {
  stage: number;
  name: string;
  algorithm: string;
}

export interface EncryptionResult {
  operation_id: string;
  original_filename: string;
  stored_filename: string;
  original_size: number;
  encrypted_size: number;
  original_sha256: string;
  encrypted_sha256: string;
  algorithms: string;
  download_url: string;
  hill_metadata: HillMetadata;
  des_metadata: DESMetadata;
  pipeline_stages: PipelineStage[];
}

export interface DecryptionResult {
  operation_id: string;
  original_filename: string;
  stored_filename: string;
  container_size: number;
  recovered_size: number;
  sha256: string;
  algorithms: string;
  integrity_verified: boolean;
  download_url: string;
  hill_metadata?: HillMetadata;
  des_metadata?: DESMetadata;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string;
}
