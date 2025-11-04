import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import json
import logging

# Firebase Admin SDK path
cred_path = Path(r"C:\Users\danie\Desktop\PunishCalculator\punish-calculator-firebase-adminsdk-efvsp-e7b7eb937f.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

# Load JSON data
with open(r"C:\Users\danie\Desktop\PunishCalculator\all_characters.json") as f:
    data = json.load(f)

# Extract Banjo Kazooie moves
banjo_data = data.get("banjo_and_kazooie")
if not banjo_data:
    logging.error("No data found for 'banjo_and_kazooie'. Exiting.")
    exit(1)

# Reference to Banjo Kazooie document under 'characters'
banjo_doc_ref = db.collection("characters").document("banjo_and_kazooie")

# Create a real document with a placeholder field
banjo_doc_ref.set({"character_name": "Banjo & Kazooie"})  # <-- This ensures the doc exists

# Now create a subcollection called 'moves'
moves_collection_ref = banjo_doc_ref.collection("moves")

# Upload each move as its own document in the 'moves' subcollection
for move_name, move_data in banjo_data.items():
    move_doc_ref = moves_collection_ref.document(move_name)
    if isinstance(move_data, dict):
        move_doc_ref.set(move_data)
    else:
        # If the move is a primitive, wrap it in a dict
        move_doc_ref.set({"value": move_data})

print("Banjo & Kazooie data uploaded: document + moves subcollection.")
