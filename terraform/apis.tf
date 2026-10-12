locals {
  wlaczone_api = [
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "firestore.googleapis.com",
    "iamcredentials.googleapis.com",
    "storage.googleapis.com",
    # Tworzy domyślne konto Compute, na którym Cloud Build buduje i wdraża
    "compute.googleapis.com",
  ]
}

resource "google_project_service" "wlaczone" {
  for_each = toset(local.wlaczone_api)

  project = var.projekt
  service = each.value

  # Wyłączenie API przy usuwaniu zasobu Terraform potrafiłoby wyłączyć
  # działającą produkcję, więc tego nie robimy
  disable_on_destroy = false
}
