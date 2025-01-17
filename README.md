# :video_game: Super Smash Bros. Ultimate Punish Calculator :game_die:
## What is SSBU Punish Calculator?
### SSBU Punish Calculator is a React.js web application tool for competitive Super Smash Bros. Ultimate players, a fighting game, where the user inputs an attack being used by a character they are fighting against, and their own character. The application then generates through a custom-made algorithm, the ways that move can be punished by your character. Outputted is a visual and verbal explanation of the options your character has.
---
### Installation  

You can download the repository and run locally on your computer by using npm start at the my-app level in terminal  
or alternatively click [here](https://ssbupunishcalculator.com/).

---

### How to use

Smash Ultimate is very "mashy" game, where characters can seemingly hit your shield with aerials and go unpunished.  
In order to show how this application can used to effect, an example is walked through.

---

#### Use Case Example  

Roy is a very mashy character, and when he is spamming on your shield it may seem completely unpunishable especially if you are not aware of which of his moves are safe or not, so for this use case we will look at Roy vs Falco

A lot of Roys love to mash Jab, so by inputting Roy into the first dropdown and then clicking on the second box you will be shown a list of all of Roy's moves. For this case we will be selecting Jab.  

<img src="media/tut 1.png" alt="Roy selected" width="700" height="350">  
<img src="media/tut 2.png" alt="Jab Selected" width="700" height="350">  

Lastly for the calculation, we must input the character which is punishing Roy, so Falco for this case.   

<img src="media/tut 3.png" alt="Falco selected" width="700" height="350">  

Once the calculate button is pressed, your calculation will be output and you will be presented with the image of the attacking move, and a picture/pictures of the move/different moves that can punish this move, and their accompanying stats such as start up time and damage.  

<img src="media/tut 4.png" alt="Calculate pressed/ Output" width="700" height="350">   

However, Falco Forward Air takes 10 frames of total start up, including 3 frames of jump squat (frames for Falco to leave the floor), so although it may punish the weak hit of Roy's Jab as that is -12, and is signified in the gif by the purple hitboxes, it cannot punish the strong hit.  

So by clicking the arrows surrounding Falco's Forward Air, it will show other moves that can punish Jab, and a true punish for the strong hit will be shown, such as Falco Neutral Air.  

<img src="media/tut 4.png" alt="Switched to Neutral Air" width="700" height="350">   



