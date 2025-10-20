import os
import firebase_admin
from firebase_admin import credentials, storage

# Path to your Firebase admin SDK JSON file
firebase_json_path = r"C:\Users\danie\Desktop\PunishCalculator\punish-calculator-firebase-adminsdk-efvsp-e7b7eb937f.json"

# Initialize Firebase app with the service account
cred = credentials.Certificate(firebase_json_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'punish-calculator.appspot.com',
    'projectId': 'punish-calculator'
})

# Reference to the storage bucket
bucket = storage.bucket()

# Base directory containing GIF folders
base_directory = r"C:\Users\danie\Desktop\Punish Calculator\currentGif DO NOT ALTER\bayonetta"

# Function to upload GIFs to Firebase Storage
def upload_gifs_to_firebase(base_dir):
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.gif'):
                local_file_path = os.path.join(root, fiWWle)
                
                # Create a blob (object) in the bucket with the same structure as the local path
                blob_path = os.path.relpath(local_file_path, base_dir).replace("\\", "/")
                blob = bucket.blob(blob_path)
                
                # Upload the file
                blob.upload_from_filename(local_file_path)
                print(f"Uploaded {local_file_path} to {blob_path} in Firebase Storage")

# Upload all GIFs from the base directory to Firebase Storage


def rename_blob_in_storage(folder_name, original_name, new_name):
    """
    Rename a GIF in Firebase Storage under a specific folder.
    - folder_name: folder in the bucket (not a full path)
    - original_name: current filename (e.g. 'Old Move.gif')
    - new_name: desired filename (e.g. 'New Move.gif')
    Returns True on success, False on failure.
    """
    # Blob paths (use forward slashes for storage)
    old_blob_path = f"{folder_name}/{original_name}"
    new_blob_path = f"{folder_name}/{new_name}"

    old_blob = bucket.blob(old_blob_path)

    if not old_blob.exists():
        print(f"No blob found at storage path: {old_blob_path}")
        return False

    try:
        # Copy to new blob
        new_blob = bucket.copy_blob(old_blob, bucket, new_blob_path)
        # Delete old blob
        old_blob.delete()
        print(f"Renamed in storage: {old_blob_path} -> {new_blob_path}")
        return True
    except Exception as e:
        print(f"Storage rename failed: {e}")
        return False

# Example usage:
#rename_blob_in_storage("ice_climbers", "Ice Climbers Ice Shot.png", "Popo Ice Shot.png")


def rename_document_in_collection(collection_name, old_doc_id, new_doc_id):
    """
    Rename a document in a Firestore collection.
    - collection_name: the collection containing the document
    - old_doc_id: current document ID
    - new_doc_id: desired document ID
    Returns True on success, False on failure.
    """
    try:
        collection_ref = db.collection(collection_name)
        old_doc_ref = collection_ref.document(old_doc_id)
        new_doc_ref = collection_ref.document(new_doc_id)

        old_doc = old_doc_ref.get()
        if not old_doc.exists:
            print(f"Document '{old_doc_id}' not found in collection '{collection_name}'")
            return False

        # Copy data to new document
        new_doc_ref.set(old_doc.to_dict())
        # Delete old document
        old_doc_ref.delete()

        print(f"Renamed document '{old_doc_id}' -> '{new_doc_id}' in collection '{collection_name}'")
        return True

    except Exception as e:
        print(f"Failed to rename document: {e}")
        return False

# Example usage:
rename_document_in_collection("kazuya", "F, F, A (66A)", "Double Dash Attack (Left Splits Kick)")
# Example usage:
# rename_gif_in_folder(base_directory, "bayonetta", "Old Move.gif", "New Move.gif", rename_in_storage=True)
