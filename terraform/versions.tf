terraform {
  required_version = ">= 1.8"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  backend "gcs" {
    bucket = "marcinmazuro-tfstate"
    prefix = "produkcja"
  }
}

provider "google" {
  project = var.projekt
  region  = var.region
}
