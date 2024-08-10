import firebase_admin
from firebase_admin import credentials, firestore
import json
import logging
# Path to your Firebase Admin SDK credentials JSON file
cred = credentials.Certificate(r'C:\Users\danie\Desktop\Punish Calculator\misc\punish-calculator-firebase-adminsdk-efvsp-59835829c7.json')
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
for collection_name, collection_data in data.items():
    collection_ref = db.collection(collection_name)
    upload_to_firestore(collection_data, collection_ref)
