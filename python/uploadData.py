import firebase_admin
from firebase_admin import credentials, firestore
import json
import logging
# Path to your Firebase Admin SDK credentials JSON file
cred = credentials.Certificate(r'C:\Users\danie\Desktop\Punish Calculator\punish-calculator-firebase-adminsdk-efvsp-59835829c7.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Load your JSON file
with open(r'C:\Users\danie\Desktop\Punish Calculator\all_grabs.json') as f:
    data = json.load(f)

def upload_to_firestore(data, parent_ref):
    if isinstance(data, dict):
        for key, value in data.items():
            try:
                logging.debug(f'Processing key: {key}, value: {value}')
                if isinstance(value, dict):
                    if parent_ref is None:
                        collection_ref = db.collection(key)
                        upload_to_firestore(value, collection_ref)
                    else:
                        doc_ref = parent_ref.document(key)
                        upload_to_firestore(value, doc_ref)
                else:
                    if isinstance(parent_ref, firestore.CollectionReference):
                        doc_ref = parent_ref.document(key)
                        doc_ref.set({key: value})
                    elif isinstance(parent_ref, firestore.DocumentReference):
                        parent_ref.set({key: value}, merge=True)
            except Exception as e:
                logging.error(f'Error processing key: {key}, value: {value}. Error: {e}')
    elif isinstance(data, list):
        for item in data:
            try:
                if isinstance(parent_ref, firestore.CollectionReference):
                    doc_ref = parent_ref.document()
                    upload_to_firestore(item, doc_ref)
                elif isinstance(parent_ref, firestore.DocumentReference):
                    sub_col_ref = parent_ref.collection()
                    upload_to_firestore(item, sub_col_ref)
            except Exception as e:
                logging.error(f'Error processing item: {item}. Error: {e}')

# Start the upload process
#for collection_name, collection_data in data.items():
    #collection_ref = db.collection(collection_name)
    #upload_to_firestore(collection_data, collection_ref)


import firebase_admin
from firebase_admin import credentials, firestore
import json
import logging

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'C:\Users\danie\Desktop\PunishCalculator\punish-calculator-firebase-adminsdk-efvsp-e7b7eb937f.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Load JSON file
with open(r'C:\Users\danie\Desktop\PunishCalculator\all_character_data.json') as f:
    data = json.load(f)

# Extract only Banjo Kazooie data
banjo_data = data.get("banjo_kazooie")
if not banjo_data:
    logging.error("No data found for 'banjo_kazooie'. Exiting.")
    exit(1)

def upload_to_banjo_doc(data, doc_ref):
    """
    Recursively upload data under the document reference for Banjo.
    Nested dictionaries are uploaded as subcollections.
    """
    for key, value in data.items():
        try:
            if isinstance(value, dict):
                # Use a subcollection for nested dicts
                subcollection_ref = doc_ref.collection(key)
                for sub_key, sub_value in value.items():
                    # Each sub_key becomes a document in the subcollection
                    sub_doc_ref = subcollection_ref.document(sub_key)
                    if isinstance(sub_value, dict):
                        # Recursive for deeper nesting
                        upload_to_banjo_doc(sub_value, sub_doc_ref)
                    else:
                        sub_doc_ref.set({sub_key: sub_value})
            else:
                # Primitive values go directly in the document
                doc_ref.set({key: value}, merge=True)
        except Exception as e:
            logging.error(f"Error uploading key: {key}, value: {value}. Error: {e}")

# Reference to Banjo Kazooie document under 'characters' collection
banjo_doc_ref = db.collection("characters").collection("banjo_kazooie")

# Upload data
upload_to_banjo_doc(banjo_data, banjo_doc_ref)

print("Banjo Kazooie data uploaded under 'characters' collection successfully.")

