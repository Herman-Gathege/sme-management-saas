#backend/app/services/etims/response_handler.py

class EtimsResponseHandler:

    @staticmethod
    def handle(response):
        if response.status_code != 200:
            return {
                "status": "FAILED",
                "error": response.text
            }

        data = response.json()

        return {
            "status": "SENT",
            "icn": data.get("icn"),
            "qr_code": data.get("qrCode"),
            "control_number": data.get("controlNumber"),
            "eat_timestamp": data.get("eatDateTime"),  
            "raw_response": data
        }