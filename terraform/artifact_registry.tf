resource "google_artifact_registry_repository" "web" {
  project       = var.project
  location      = var.region
  repository_id = "web"
  format        = "DOCKER"
  description   = "Web application images"

  depends_on = [google_project_service.enabled]
}
