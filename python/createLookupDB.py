import sqlite3
import firebase_admin
from firebase_admin import credentials, initialize_app, storage, firestore
from datetime import timedelta

cred = credentials.Certificate(r'C:\Users\danie\Desktop\Punish Calculator\punishcalculator\misc\punish-calculator-firebase-adminsdk-efvsp-59835829c7.json')
firebase_admin.initialize_app(cred, {
        'storageBucket': 'punish-calculator.appspot.com'
})

characters = [
    "banjo_and_kazooie", "bayonetta", "bowser", "bowser_jr", "byleth", 
    "captain_falcon", "chrom", "cloud", "corrin", "daisy", "dark_pit", 
    "dark_samus", "diddy_kong", "donkey_kong", "dr_mario", "duck_hunt", 
    "falco", "fox", "ganondorf", "greninja", "hero", "ice_climbers", "ike", 
    "incineroar", "inkling", "isabelle", "jigglypuff", "joker", "kazuya", 
    "ken", "king_dedede", "king_k_rool", "kirby", "link", "little_mac", 
    "lucario", "lucas", "lucina", "luigi", "mario", 
    "marth", "mega_man", 
    "meta_knight", "mewtwo", "mii_brawler", "mii_swordfighter", "min_min", 
    "mr_game_and_watch", "mythra", "ness", "olimar", "pac_man", "palutena", 
    "peach", "pichu", "pikachu", "pirahna_plant", "pit", "squirtle", "ivysaur", 
    "charizard", "pyra", "richter", "ridley", "rob", "robin", "rosalina_and_luma", 
    "roy", "ryu", "samus", "sephiroth", "sheik", "shulk", "simon", "snake", 
    "sonic", "sora", "steve", "terry", "toon_link", "villager", "wario", 
    "wii_fit_trainer", "wolf", "yoshi", "young_link", "zelda", "zero_suit_samus"
]

db = firestore.client()
# Connect to SQLite (creates the database if it doesn't exist)
conn = sqlite3.connect('moves.db')
cursor = conn.cursor()

# Create a table for storing move image URLs
cursor.execute('''
    CREATE TABLE IF NOT EXISTS moves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_name TEXT,
        image_name TEXT
    )
''')

conn.commit()

def get_public_url(file_name):
    # URL encode the file name to be used in the Firebase URL
    encoded_file_name = urllib.parse.quote(file_name, safe='')
    bucket_name = 'your-project-id.appspot.com'
    return f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_file_name}?alt=media"

# Function to fetch image names and insert them into SQLite
def store_image_names_in_db():
    bucket = storage.bucket()

    for character in characters:
        # Define the folder path in Firebase Storage
        folder = f'{character}/'
        blobs = bucket.list_blobs(prefix=folder)  # List all files under the folder

        for blob in blobs:
            if blob.name.endswith('.gif'):  # Check if it's an image file
                image_name = blob.name.split('/')[-1]  # Get the image name

                # Insert into SQLite database
                cursor.execute('''
                    INSERT INTO moves (character_name, image_url)
                    VALUES (?, ?)
                ''', (character, image_name))

                print(f"Inserted {character}'s move with image name {image_name}")

    conn.commit()

# Run the function to fetch and store image names in the database
store_image_names_in_db()

# Close the SQLite connection when done
conn.close()
# List of characters to process
