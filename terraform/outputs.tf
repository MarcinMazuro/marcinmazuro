output "adres_uslugi" {
  description = "Adres Cloud Run, pod którym stoi aplikacja"
  value       = google_cloud_run_v2_service.web.uri
}

output "konto_aplikacji" {
  description = "Konto usługi, na którym działa aplikacja"
  value       = google_service_account.aplikacja.email
}

output "dostawca_wif" {
  description = "Dostawca tożsamości dla GitHub Actions"
  value       = google_iam_workload_identity_pool_provider.github.name
}
