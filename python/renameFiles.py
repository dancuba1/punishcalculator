import os
import re

from firebase_admin import credentials, storage


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

def addOne(path):
    for file in os.listdir(path):
        file_name, file_extension = os.path.splitext(file)
        new_file_name = file_name + "1" + file_extension
        os.rename(file, new_file_name)

def minusOne(path):
    for file in os.listdir(path):
    # Split the file name and its extension
        file_name, file_extension = os.path.splitext(file)
        if file_name.endswith("1"):
            # Remove the '1' at the end of the file name
            new_file_name = file_name[:-1] + file_extension
             # Rename the file
            os.rename(file, new_file_name)

            
def splitCapitals(path):
    for file in os.listdir(path):
    # Split the file name and its extension
        file_name, file_extension = os.path.splitext(file)
        new_file_name = add_space_before_capitals(file_name) + file_extension
        os.rename(file, new_file_name)



def add_space_before_capitals(filename):
    # Use regex to find capital letters and add a space before them
    return re.sub(r'(?<!^)(?=[A-Z])', ' ', filename)

def setFullNames(path):
    for file in os.listdir(path):
    # Split the file name and its extension
        file_name, file_extension = os.path.splitext(file)

        if " B " in file:
            new_file_name = file.replace(" B ", " Back ")

        if " N " in file:
            new_file_name = file.replace(" N ", " Neutral ")

        if " U " in file:
            new_file_name = file.replace(" U ", " Up ")

        if " F " in file:
            new_file_name = file.replace(" F ", " Forward ")

        if " G " in file:
            new_file_name = file.replace(" G ", " Ground")

        if " B " in file:
            new_file_name = file.replace(" B ", "Back")

        new_file_name =  new_file_name + file_extension
        os.rename(file, new_file_name)

def remove_double_spaces(filename):
    # Replace multiple spaces with a single space
    return re.sub(r'\s+', ' ', filename).strip()

def removeDoubleSpaces(path):
    for file in os.listdir(path):
        # Generate the new file name with double spaces removed
        new_file_name = remove_double_spaces(file)
        
        # Rename the file if the name has changed
        if file != new_file_name:
            os.rename(file, new_file_name)
            print(f"Renamed '{file}' to '{new_file_name}'")
        else:
            print(f"No change for: {file}")


def setFullNames(path):
    for file in os.listdir(path):
    # Split the file name and its extension
        try:
            file_name, file_extension = os.path.splitext(file)
            new_file_name = file_name
            if " B " in file:
                new_file_name = file_name.replace(" B ", " Back ")

            if " N " in file:
                new_file_name = file_name.replace(" N ", " Neutral ")

            if " U " in file:
                new_file_name = file_name.replace(" U ", " Up ")

            if " F " in file:
                new_file_name = file_name.replace(" F ", " Forward ")

            if file_name.endswith(" G") and "Ground" not in file_name in file:
                new_file_name = file_name.replace(" G", " Ground")

            if " D " in file:
                new_file_name = file_name.replace(" D ", " Down ")

            if file_name.endswith(" A") and "Attack" not in file_name and "Air" not in file_name:
                new_file_name = file_name.replace(" A", " Air")
            

            new_file_name =  new_file_name + file_extension
            if file != new_file_name:
                    os.rename(file, new_file_name)
                    print(f"Renamed '{file}' to '{new_file_name}'")
            else:
                print(f"No change for: {file}")
        except Exception as e:
            print(e)
        
        

def add_space_before_number(path):
    for file in os.listdir(path):
    # Split the file name and its extension
        try:
            file_name, file_extension = os.path.splitext(file)
            pattern = r"(.*?)(\d+)$"
            
            # Substitute the matched pattern with a space before the number
            new_file_name = re.sub(pattern, r"\1 \2", file_name)
            new_file_name =  new_file_name + file_extension
            if file != new_file_name:
                    os.rename(file, new_file_name)
                    print(f"Renamed '{file}' to '{new_file_name}'")
            else:
                print(f"No change for: {file}")
            
        except Exception as e:
            print(e)


def remove_spaces_around_parentheses(path):
    for file in os.listdir(path):
        # Split the file name and its extension
        try:
            file_name, file_extension = os.path.splitext(file)
            
            # Remove space after "("
            new_file_name = re.sub(r"\(\s+", "(", file_name)
    
            # Remove space before ")" using the modified new_file_name
            new_file_name = re.sub(r"\s+\)", ")", new_file_name)  # <- Corrected this line
            
            # Combine the new file name with its extension
            new_file_name = new_file_name + file_extension
            
            # Check if the name has changed and rename if necessary
            if file != new_file_name:
                os.rename(file, new_file_name)
                print(f"Renamed '{file}' to '{new_file_name}'")
            else:
                print(f"No change for: {file}")
            
        except Exception as e:
            print(f"Error processing '{file}': {e}")
    

def formatGifs():
    for char in characters:
        path = os.chdir(f"C:\\Users\\danie\\Desktop\\Punish Calculator\\gifsTest\\{char}")
        splitCapitals(path)
        add_space_before_number(path)
        removeDoubleSpaces(path)
        remove_spaces_around_parentheses(path)
        setFullNames(path)

    
def formatCharizard():
    path = os.chdir(f"C:\\Users\\danie\\Desktop\\Punish Calculator\\gifsTest\\charizard")
    for file in os.listdir(path):
    # Split the file name and its extension
        try:
            file_name, file_extension = os.path.splitext(file)
            new_file_name = file_name
            if "charitard" in file:
                new_file_name = file_name.replace("charitard", "Charizard")

            

            new_file_name =  new_file_name + file_extension
            if file != new_file_name:
                    os.rename(file, new_file_name)
                    print(f"Renamed '{file}' to '{new_file_name}'")
            else:
                print(f"No change for: {file}")
        except Exception as e:
            print(e)
        

def formatBanjo():
    path = os.chdir(f"C:\\Users\\danie\\Desktop\\Punish Calculator\\gifsTest\\rob")
    for file in os.listdir(path):
    # Split the file name and its extension
        try:
            file_name, file_extension = os.path.splitext(file)
            new_file_name = file_name
            if "R O Back" in file:
                new_file_name = file_name.replace("R O Back", "ROB")

            

            new_file_name =  new_file_name + file_extension
            if file != new_file_name:
                    os.rename(file, new_file_name)
                    print(f"Renamed '{file}' to '{new_file_name}'")
            else:
                print(f"No change for: {file}")
        except Exception as e:
            print(e)
        

formatBanjo()
#formatBanjo()    
#formatGifs()