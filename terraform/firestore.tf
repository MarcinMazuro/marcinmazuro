# Wiadomości z formularza kontaktowego, docelowo także rezerwacje rozmów.
# eur3 to wielorejon europejski - trzyma dane w UE i przeżywa awarię regionu.
resource "google_firestore_database" "baza" {
  project     = var.projekt
  name        = "(default)"
  location_id = "eur3"
  type        = "FIRESTORE_NATIVE"

  delete_protection_state = "DELETE_PROTECTION_ENABLED"
  deletion_policy         = "ABANDON"

  depends_on = [google_project_service.wlaczone]
}
