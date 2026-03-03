# backend/app/services/encryption_service.py
from cryptography.fernet import Fernet
from flask import current_app
import base64
import os

class EncryptionService:

    @staticmethod
    def _get_cipher():
        secret_key = current_app.config.get("KRA_ENCRYPTION_KEY")
        if not secret_key:
            raise ValueError("KRA_ENCRYPTION_KEY not configured")

        return Fernet(secret_key)

    @staticmethod
    def encrypt(value: str) -> str:
        cipher = EncryptionService._get_cipher()
        encrypted = cipher.encrypt(value.encode())
        return encrypted.decode()

    @staticmethod
    def decrypt(value: str) -> str:
        cipher = EncryptionService._get_cipher()
        decrypted = cipher.decrypt(value.encode())
        return decrypted.decode()