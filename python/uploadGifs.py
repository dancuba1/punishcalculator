import os
import firebase_admin
from firebase_admin import credentials, storage

# Path to your Firebase admin SDK JSON file
firebase_json_path = r"C:\Users\danie\Desktop\Punish Calculator\punishcalculator\misc\punish-calculator-firebase-adminsdk-efvsp-59835829c7.json"

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
                local_file_path = os.path.join(root, file)
                
                # Create a blob (object) in the bucket with the same structure as the local path
                blob_path = os.path.relpath(local_file_path, base_dir).replace("\\", "/")
                blob = bucket.blob(blob_path)
                
                # Upload the file
                blob.upload_from_filename(local_file_path)
                print(f"Uploaded {local_file_path} to {blob_path} in Firebase Storage")

# Upload all GIFs from the base directory to Firebase Storage
upload_gifs_to_firebase(base_directory)
