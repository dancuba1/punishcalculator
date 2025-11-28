import firebase_admin
from firebase_admin import credentials, storage, firestore
import logging

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r"C:\Users\danie\Desktop\PunishCalculator\punish-calculator-firebase-adminsdk-efvsp-e7b7eb937f.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'punish-calculator.appspot.com'  # replace with your Storage bucket
})


bucket = storage.bucket()
logging.basicConfig(level=logging.INFO)



def auto_rename_jabs(character_name):


    # Generate the renaming tuples for this character
    char_name_formatted = " ".join(word.capitalize() for word in character_name.split("_"))
    
    # Standard jab renaming patterns
    jab_patterns = [
        ("Jab Rapid", "Rapid Jab"),
        ("Jab Rapid End", "Rapid Jab Finisher"),
        ("Jab Rapid Finisher", "Rapid Jab Finisher")

    ]

    # Generate the renaming tuples for this character
    renames = [(f"{char_name_formatted} {old}", f"{char_name_formatted} {new}") for old, new in jab_patterns]

    # Perform the renaming
    rename_files_in_storage(character_name, renames)

def rename_files_in_storage(character_name, rename_list):
    """
    Rename files in a character's Storage folder.

    Parameters:
    - character_name: str, e.g., 'ken'
    - rename_list: list of tuples [(old_name, new_name), ...] (without extensions)
    """
    
    # List all blobs in the folder for debugging
    logging.info(f"Listing all files in folder '{character_name}/':")
    blobs = list(bucket.list_blobs(prefix=f"{character_name}/"))
    if not blobs:
        logging.warning(f"No files found in folder '{character_name}/'")
    for blob in blobs:
        logging.info(f"Found file: {blob.name}")

    for old_name, new_name in rename_list:
        found = False
        for ext in ['.gif', '.png', '']:  # check common extensions
            old_path = f"{character_name}/{old_name}{ext}"
            new_path = f"{character_name}/{new_name}{ext}"

            old_blob = bucket.blob(old_path)
            new_blob = bucket.blob(new_path)

            logging.debug(f"Checking if exists: {old_path}")

            if old_blob.exists():
                # Correct way to copy
                bucket.copy_blob(old_blob, bucket, new_path)
                old_blob.delete()  # delete old file
                logging.info(f"Renamed {old_path} -> {new_path}")
                found = True
                break
        
        if not found:
            logging.warning(
                f"File '{old_name}' not found in folder '{character_name}/' "
                "(checked .gif, .png, no extension)"
            )

db = firestore.client()
def rename_move_in_firestore(character, old_move, new_move):
    """
    Renames a move document under:
    characters/{character}/moves/{old_move}
    
    to:
    characters/{character}/moves/{new_move}
    """
    print_moves_for_character(character)
    old_doc_ref = db.collection("characters").document(character).collection("moves").document(old_move)
    new_doc_ref = db.collection("characters").document(character).collection("moves").document(new_move)

    # Fetch old doc
    old_doc = old_doc_ref.get()

    if not old_doc.exists:
        logging.warning(f"Move '{old_move}' does not exist for character '{character}'.")
        return

    # Get the data
    data = old_doc.to_dict()

    # Create new document
    new_doc_ref.set(data)

    # Delete old document
    old_doc_ref.delete()

    logging.info(f"Renamed move '{old_move}' → '{new_move}' for character '{character}'.")

def print_moves_for_character(character):
    """
    Prints all move document IDs under:
    characters/{character}/moves/
    surrounded by dashes.
    """

    moves_ref = db.collection("characters").document(character).collection("moves")
    docs = list(moves_ref.stream())

    if not docs:
        print(f"No moves found for character '{character}'.")
        return

    print(f"Moves for '{character}':")
    for doc in docs:
        print(f"--- {doc.id} ---")

def callRenameStorage():
    rename_files_in_storage(
        'min_min',
        [
            ('Min Min Arms Hook Dragon Aerial', 'Min Min Arms Hook'),
            


         

        ]
    )


def callRenameFirestore():
    rename_move_in_firestore('kazuya', 'Demons Wrath (Side Taunt)', 'Crounching')

def main():
    callRenameStorage()
    #callRenameFirestore()


    #auto_rename_jabs('mewtwo')


if __name__ == "__main__":
    main()
