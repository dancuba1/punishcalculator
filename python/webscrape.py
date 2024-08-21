from bs4 import BeautifulSoup
import requests
import os

characterNames = [
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

def scanWebPage(pageToScrape):
    soup = BeautifulSoup(pageToScrape.text, "html.parser")
    moveNames = soup.findAll("div", class_="movename")
    startUp = soup.findAll("div", class_="startup")
    totalFrames = soup.findAll("div", class_="totalframes")
    landingLag = soup.findAll("div", class_="landinglag")
    notes = soup.findAll("div", class_="notes")
    baseDamage = soup.findAll("div", class_="basedamage")
    shieldLag = soup.findAll("div", class_="shieldlag")
    shieldStun = soup.findAll("div", class_="shieldstun")
    whichHitbox = soup.findAll("div", class_="whichhitbox")
    advantage = soup.findAll("div", class_="advantage")
    activeFrames = soup.findAll("div", class_="activeframes")
    endLag = soup.findAll("div", class_="endlag")

    def clean_text(text):
        return text.replace("\u2014", "").strip()

    moves_data = {}

    '''
    for moveName, start, total, landing, note, base, shieldL, shieldS, hitbox, adv, active, end in zip(
        moveNames, startUp, totalFrames, landingLag, notes, baseDamage, shieldLag, shieldStun, 
        whichHitbox, advantage, activeFrames, endLag):
        moves_data[clean_text(moveName.text)] = {
            "startup": clean_text(start.text),
            "totalFrames": clean_text(total.text),
            "landingLag": clean_text(landing.text),
            "notes": clean_text(note.text),
            "baseDamage": clean_text(base.text),
            "shieldLag": clean_text(shieldL.text),
            "shieldStun": clean_text(shieldS.text),
            "whichHitbox": clean_text(hitbox.text),
            "advantage": clean_text(adv.text),
            "activeFrames": clean_text(active.text),
            "endLag": clean_text(end.text),
        }
    '''

    for moveName, start, total, landing, note, base, active, end in zip(
        moveNames, startUp, totalFrames, landingLag, notes, baseDamage, activeFrames, endLag):
        clean_move_name = clean_text(moveName.text)

        if "Grab" in clean_move_name:
            moves_data[clean_text(moveName.text)] = {
            "startup": clean_text(start.text),
            "totalFrames": clean_text(total.text),
            "landingLag": clean_text(landing.text),
            "notes": clean_text(note.text),
            "baseDamage": clean_text(base.text),
            "activeFrames": clean_text(active.text),
            "endLag": clean_text(end.text),
         }


    
    return moves_data

all_characters_data = {}


base_directory = r"C:\Users\danie\Desktop\Punish Calculator"


def download_gifs(pageToScrape, character):
    soup = BeautifulSoup(pageToScrape.text, "html.parser")
    gifLinks = soup.findAll("a", class_="hitboximg")

    for gifLink in gifLinks:
        gif_url = "https://ultimateframedata.com/" + gifLink['data-featherlight']

        # Create directory for the character if it doesn't exist
        character_directory = os.path.join(base_directory, character)
        os.makedirs(character_directory, exist_ok=True)

        # Generate the GIF filename
        gif_filename = os.path.join(character_directory, os.path.basename(gif_url))

        # Download the GIF
        response = requests.get(gif_url)
        if response.status_code == 200:
            with open(gif_filename, 'wb') as gif_file:
                gif_file.write(response.content)
            print(f"Downloaded {os.path.basename(gif_url)} for {character}")
        else:
            print(f"Failed to download {os.path.basename(gif_url)} for {character}")


def gifScrape():
    for character in characterNames:
        url = f"https://ultimateframedata.com/{character}.php"
        page = requests.get(url)
        print(f"Scraping GIFs for {character}...")
        if page.status_code == 200:
            download_gifs(page, character)
        else:
            print(f"Failed to retrieve data for {character}")



def webscrape():
    for character in characterNames:
        url = f"https://ultimateframedata.com/{character}.php"
        page = requests.get(url)
        print(f"Scraping data for {character}...")
        character_data = scanWebPage(page)
        if page.status_code == 200:
            all_characters_data[character] = scanWebPage(page)
        else:
            print(f"Failed to retrieve data for {character}")

    import json

    with open('all_grabs.json','w') as f:
        json.dump(all_characters_data, f, indent = 2)
    # Example to print data for a specific character and move
    import pprint
    pp = pprint.PrettyPrinter(indent=2)

gifScrape()