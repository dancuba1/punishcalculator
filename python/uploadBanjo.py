import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import json
import logging

# Initialise Firebase only once
cred_path = Path(r"C:\Users\danie\Desktop\PunishCalculator\punish-calculator-firebase-adminsdk-efvsp-e7b7eb937f.json")
cred = credentials.Certificate(cred_path)

# Prevent double-initialisation if reused by other scripts
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()


def upload_character_to_firestore(character_name: str, json_path: str):
    """
    Uploads a single character's move data from the JSON file into Firestore.
    
    Structure created:
    characters/{character_name}/moves/{move_name}
    """
    # Load JSON
    with open(json_path, "r") as f:
        character_data = json.load(f)

    # Retrieve character data

    if not character_data:
        logging.error(f"No data found for '{character_name}'. Exiting function.")
        return

    # Reference to parent document
    char_doc_ref = db.collection("characters").document(character_name)

    # Create the parent document with a placeholder
    char_doc_ref.set({"character_name": character_name})

    # Subcollection for moves
    moves_ref = char_doc_ref.collection("moves")

    # Upload moves
    for move_name, move_data in character_data.items():
        doc_id = safe_doc_id(move_name)
        move_doc_ref = moves_ref.document(doc_id)

        if isinstance(move_data, dict):
            move_doc_ref.set(move_data)
        else:
            move_doc_ref.set({"value": move_data})


    print(f"{character_name} uploaded successfully with {len(character_data)} moves.")

import re

def safe_doc_id(name: str) -> str:
    # Replace slashes with a dash
    name = name.replace("/", "-")
    # Remove characters Firestore/path APIs don't like
    # Trim to reasonable length
    return name[:80]


upload_character_to_firestore(
     character_name="kazuya",
     json_path=r"C:\Users\danie\Desktop\PunishCalculator\punishcalculator\kazuya.json"
)
