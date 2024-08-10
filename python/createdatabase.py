import json

# Load JSON data from a file
with open('all_characters_data.json', 'r') as file:
    data = json.load(file)

import sqlite3

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('moves.db')
cursor = conn.cursor()

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS moves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER,
    move_name TEXT,
    startup TEXT,
    totalFrames TEXT,
    landingLag TEXT,
    notes TEXT,
    baseDamage TEXT,
    shieldLag TEXT,
    shieldStun TEXT,
    whichHitbox TEXT,
    advantage TEXT,
    activeFrames TEXT,
    endLag TEXT,
    FOREIGN KEY (character_id) REFERENCES characters (id)
)
''')

# Commit the changes
conn.commit()


def createDB():
        
    for character, moves in data.items():
        # Insert character
        cursor.execute('INSERT INTO characters (name) VALUES (?)', (character,))
        character_id = cursor.lastrowid

        # Insert moves
        for move_name, move_details in moves.items():
            cursor.execute('''
            INSERT INTO moves (character_id, move_name, startup, totalFrames, landingLag, notes, baseDamage, shieldLag, shieldStun, whichHitbox, advantage, activeFrames, endLag)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                character_id,
                move_name,
                move_details.get('startup', ''),
                move_details.get('totalFrames', ''),
                move_details.get('landingLag', ''),
                move_details.get('notes', ''),
                move_details.get('baseDamage', ''),
                move_details.get('shieldLag', ''),
                move_details.get('shieldStun', ''),
                move_details.get('whichHitbox', ''),
                move_details.get('advantage', ''),
                move_details.get('activeFrames', ''),
                move_details.get('endLag', '')
            ))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    import sqlite3

def get_move_data(character_name, move_name):
    # Connect to the SQLite database
    conn = sqlite3.connect('moves.db')
    cursor = conn.cursor()
    
    # Write the SQL query
    query = '''
    SELECT moves.move_name, moves.startup, moves.totalFrames, moves.landingLag, moves.notes, moves.baseDamage, moves.shieldLag, moves.shieldStun, moves.whichHitbox, moves.advantage, moves.activeFrames, moves.endLag
    FROM characters
    JOIN moves ON characters.id = moves.character_id
    WHERE characters.name = ? AND moves.move_name = ?
    '''
    
    # Execute the query with parameters
    cursor.execute(query, (character_name, move_name))
    
    # Fetch the results
    move_data = cursor.fetchone()
    
    # Close the connection
    conn.close()
    
    # Check if move data is found
    if move_data:
        # Create a dictionary to display the data in a readable format
        columns = ["move_name", "startup", "totalFrames", "landingLag", "notes", "baseDamage", "shieldLag", "shieldStun", "whichHitbox", "advantage", "activeFrames", "endLag"]
        move_data_dict = dict(zip(columns, move_data))
        return move_data_dict
    else:
        return None

# Example usage
character_name = "zero_suit_samus"
move_name = "Jab 1"
move_data = get_move_data(character_name, move_name)

if move_data:
    print("Move Data:")
    for key, value in move_data.items():
        print(f"{key}: {value}")
else:
    print("Move not found.")
