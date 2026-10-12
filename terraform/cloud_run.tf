# Konto, na którym działa aplikacja - tylko dostęp do Firestore
resource "google_service_account" "aplikacja" {
  project      = var.projekt
  account_id   = "aplikacja-web"
  display_name = "Aplikacja webowa na Cloud Run"
}

resource "google_project_iam_member" "aplikacja_firestore" {
  project = var.projekt
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.aplikacja.email}"
}

resource "google_cloud_run_v2_service" "web" {
  project             = var.projekt
  name                = "marcinmazuro-web"
  location            = var.region
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.aplikacja.email

    scaling {
      # Portfolio nie ma ruchu konwersyjnego jak sklep - zimny start
      # jest akceptowalny, a usługa bez ruchu nic nie kosztuje
      min_instance_count = 0
      max_instance_count = 3
    }

    containers {
      # Obraz startowy Google; prawdziwy podmienia pipeline przy wdrożeniu
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
    # Obraz podmienia pipeline przy każdym wdrożeniu. Gdyby Terraform
    # nim zarządzał, cofałby produkcję do wersji z pliku.
    ignore_changes = [
      template[0].containers[0].image,
      template[0].revision,
      template[0].labels,
      client,
      client_version,
      scaling,
    ]
  }

  depends_on = [google_project_service.wlaczone]
}

resource "google_cloud_run_v2_service_iam_member" "publiczny" {
  project  = var.projekt
  location = var.region
  name     = google_cloud_run_v2_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
