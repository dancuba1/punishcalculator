import firebase_admin
from firebase_admin import credentials, storage
import logging

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r"C:\Users\danie\Desktop\PunishCalculator\punish-calculator-firebase-adminsdk-efvsp-e7b7eb937f.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'punish-calculator.appspot.com'  # replace with your Storage bucket
})


bucket = storage.bucket()
logging.basicConfig(level=logging.INFO)

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

# Example usage:
rename_files_in_storage(
    'ken',
    [
        ('Ken Shoryuken Heavy', 'Ken Flame Shoryuken'),
        ('Ken Shoryuken Light', 'Ken Shoryuken'),
        ('Ken Shoryuken Medium Input', 'Ken True Shoryuken'),
        ('Ken Shoryuken Heavy Input', 'Ken True Flame Shoryuken')
    ]
)
