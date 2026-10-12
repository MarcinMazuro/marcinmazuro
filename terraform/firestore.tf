# Contact form messages, later also call bookings.
# eur3 is a European multi-region - keeps data in the EU and survives a regional outage.
resource "google_firestore_database" "default" {
  project     = var.project
  name        = "(default)"
  location_id = "eur3"
  type        = "FIRESTORE_NATIVE"

  delete_protection_state = "DELETE_PROTECTION_ENABLED"
  deletion_policy         = "ABANDON"

  depends_on = [google_project_service.enabled]
}
