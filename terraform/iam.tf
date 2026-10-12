# Wdrożenia z GitHuba bez trzymania klucza JSON w repozytorium
resource "google_service_account" "wdrozenia" {
  project      = var.projekt
  account_id   = "github-deployer"
  display_name = "Deploy z GitHub Actions"
}

locals {
  role_wdrozeniowe = [
    "roles/cloudbuild.builds.editor",
    "roles/storage.admin",
    "roles/iam.serviceAccountUser",
    "roles/run.viewer",
  ]

  role_budowania = [
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/artifactregistry.writer",
    "roles/logging.logWriter",
    "roles/storage.admin",
  ]
}

resource "google_project_iam_member" "wdrozenia" {
  for_each = toset(local.role_wdrozeniowe)

  project = var.projekt
  role    = each.value
  member  = "serviceAccount:${google_service_account.wdrozenia.email}"
}

# Cloud Build buduje obraz i wdraża usługę na domyślnym koncie Compute
resource "google_project_iam_member" "budowanie" {
  for_each = toset(local.role_budowania)

  project = var.projekt
  role    = each.value
  member  = "serviceAccount:${var.numer_projektu}-compute@developer.gserviceaccount.com"

  depends_on = [google_project_service.wlaczone]
}

resource "google_iam_workload_identity_pool" "github" {
  project                   = var.projekt
  workload_identity_pool_id = "github"
  display_name              = "GitHub Actions"
}

resource "google_iam_workload_identity_pool_provider" "github" {
  project                            = var.projekt
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc"
  display_name                       = "GitHub OIDC"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  # Bez tego warunku token z dowolnego repozytorium na GitHubie
  # mógłby wdrażać na tę produkcję
  attribute_condition = "assertion.repository=='${var.repozytorium_github}'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account_iam_member" "github_do_konta" {
  service_account_id = google_service_account.wdrozenia.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/projects/${var.numer_projektu}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github.workload_identity_pool_id}/attribute.repository/${var.repozytorium_github}"
}
