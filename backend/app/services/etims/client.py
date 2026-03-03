#backend/app/services/etims/client.py

import requests
from flask import current_app
from app.models.kra_profile import KRAProfile
from app.services.encryption_service import EncryptionService


class EtimsClient:

    def __init__(self, organization_id):
        self.profile = KRAProfile.query.filter_by(
            organization_id=organization_id,
            is_verified=True
        ).first()

        if not self.profile:
            raise Exception("KRA profile not verified")

        self.base_url = self._get_base_url()
        self.username = self.profile.etims_username
        self.password = EncryptionService.decrypt(
            self.profile.encrypted_password
        )

        self.token = None

    def _get_base_url(self):
        if self.profile.environment == "live":
            return current_app.config["ETIMS_LIVE_URL"]
        return current_app.config["ETIMS_SANDBOX_URL"]

    def authenticate(self):
        url = f"{self.base_url}/authenticate"

        response = requests.post(url, json={
            "username": self.username,
            "password": self.password
        })

        if response.status_code != 200:
            raise Exception("eTIMS authentication failed")

        self.token = response.json().get("access_token")
        return self.token

    # def send_invoice(self, payload):
    #     if not self.token:
    #         self.authenticate()

    #     url = f"{self.base_url}/invoices"

    #     response = requests.post(
    #         url,
    #         json=payload,
    #         headers={
    #             "Authorization": f"Bearer {self.token}"
    #         }
    #     )

    #     return response

    def send_invoice(self, payload):

        mode = current_app.config.get("ETIMS_MODE", "mock")

        if mode == "mock":
            class MockResponse:
                status_code = 200

                def json(self):
                    return {
                        "icn": "ICN123456789",
                        "qrCode": "QRDATA123",
                        "controlNumber": "CTRL987654"
                    }

                @property
                def text(self):
                    return "Mock success"

            return MockResponse()

        # REAL MODE BELOW
        if not self.token:
            self.authenticate()

        url = f"{self.base_url}/invoices"

        response = requests.post(
            url,
            json=payload,
            headers={
                "Authorization": f"Bearer {self.token}"
            }
        )

        return response