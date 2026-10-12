locals {
  enabled_apis = [
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "firestore.googleapis.com",
    "iamcredentials.googleapis.com",
    "storage.googleapis.com",
    # Creates the default Compute service account Cloud Build builds and deploys with
    "compute.googleapis.com",
  ]
}

resource "google_project_service" "enabled" {
  for_each = toset(local.enabled_apis)

  project = var.project
  service = each.value

  # Disabling an API when a Terraform resource is removed could take down
  # production, so we never do it
  disable_on_destroy = false
}
