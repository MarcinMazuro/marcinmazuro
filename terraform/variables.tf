variable "projekt" {
  description = "Identyfikator projektu GCP"
  type        = string
  default     = "marcinmazuro"
}

variable "numer_projektu" {
  description = "Numer projektu GCP, używany w Workload Identity Federation"
  type        = string
  default     = "251571632782"
}

variable "region" {
  description = "Region usług. europe-central2 odpada: nie pozwala tworzyć mapowań domen w Cloud Run"
  type        = string
  default     = "europe-west1"
}

variable "repozytorium_github" {
  description = "Repozytorium uprawnione do wdrożeń przez OIDC"
  type        = string
  default     = "MarcinMazuro/marcinmazuro"
}
