import firebase_admin
from firebase_admin import credentials, firestore
import logging
import time

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'C:\Users\danie\Desktop\Punish Calculator\misc\punish-calculator-firebase-adminsdk-efvsp-59835829c7.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def reformat_data():
    # Get all collections (each collection is a character's moves)
    collections = db.collections()
    
    for collection in collections:
        char_name = collection.id  # Character name is the collection ID
        logging.info(f'Reformatting data for character collection: {char_name}')
        
        # Create or get the new character document
        char_ref = db.collection('characters').document(char_name)

        # Create the moves sub-collection
        moves_ref = char_ref.collection('moves')

        # Read all documents in the character's collection
        docs = collection.stream()

        for doc in docs:
            doc_data = doc.to_dict()

            # Assuming the document data directly represents move stats
            move_name = doc.id  # Document ID is the move name
            
            # Check if the move name contains "Air" and set isAerial field
            is_aerial = 'Air' in move_name
            doc_data['isAerial'] = is_aerial

            is_up_smash = 'Up Smash' in move_name
            doc_data['isUpSmash'] = is_up_smash

            is_up_b = 'Up B' in move_name
            doc_data['isUpB'] = is_up_b

        

            # Upload move data to the new structure
            moves_ref.document(move_name).set(doc_data, merge=True)

        logging.info(f'Completed reformatting for character: {char_name}')
        time.sleep(1)  # Add delay to avoid rate limits

    logging.info('Reformatting completed for all characters.')

reformat_data()
