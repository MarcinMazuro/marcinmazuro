variable "project" {
  description = "GCP project ID"
  type        = string
  default     = "marcinmazuro"
}

variable "project_number" {
  description = "GCP project number, used by Workload Identity Federation"
  type        = string
  default     = "251571632782"
}

variable "region" {
  description = "Service region. europe-central2 is out: it does not allow Cloud Run domain mappings"
  type        = string
  default     = "europe-west1"
}

variable "github_repository" {
  description = "The only repository allowed to deploy via OIDC"
  type        = string
  default     = "MarcinMazuro/marcinmazuro"
}
