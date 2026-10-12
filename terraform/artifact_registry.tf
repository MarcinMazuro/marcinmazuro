resource "google_artifact_registry_repository" "web" {
  project       = var.projekt
  location      = var.region
  repository_id = "web"
  format        = "DOCKER"
  description   = "Obrazy aplikacji webowej"

  depends_on = [google_project_service.wlaczone]
}
