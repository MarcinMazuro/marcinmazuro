# Identity the app runs as - Firestore access only
resource "google_service_account" "web_app" {
  project      = var.project
  account_id   = "web-app"
  display_name = "Web app on Cloud Run"
}

resource "google_project_iam_member" "web_app_firestore" {
  project = var.project
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.web_app.email}"
}

resource "google_cloud_run_v2_service" "web" {
  project             = var.project
  name                = "marcinmazuro-web"
  location            = var.region
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.web_app.email

    scaling {
      # A portfolio has no conversion-critical traffic like a shop - a cold
      # start is acceptable, and an idle service costs nothing
      min_instance_count = 0
      max_instance_count = 3
    }

    containers {
      # Google's starter image; the pipeline swaps in the real one on deploy
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        cpu_idle = true
      }
    }
  }

  lifecycle {
    # The pipeline replaces the image on every deploy. If Terraform managed
    # it, it would roll production back to the version in this file.
    ignore_changes = [
      template[0].containers[0].image,
      template[0].revision,
      template[0].labels,
      client,
      client_version,
      scaling,
    ]
  }

  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project
  location = var.region
  name     = google_cloud_run_v2_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
