/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {distance} = require("fastest-levenshtein"); // String similarity

// Initialize Firebase Admin SDK
admin.initializeApp();

exports.getBestMoveImage = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.set("Access-Control-Allow-Methods", "GET, POST"); // Allow methods
  res.set("Access-Control-Allow-Headers", "Content-Type"); // Allow headers

  if (req.method === "OPTIONS") {
    // Handle preflight requests
    return res.status(204).send("");
  }

  const {moveName, capitalChar, characterName} = req.body;
  console.log("Received parameters:", {moveName, characterName, capitalChar});

  try {
    // Reference the character's directory in Firebase Storage
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({
      prefix: `${characterName}/`});
    console.log("Files in bucket:", files.map((file) => file.name));

    const effCharName = characterNameValidation(capitalChar, moveName);
    // Filter and find the best match
    let bestMatch = null;
    let bestDistance = Infinity;

    const tName = `${effCharName} ${moveName}`.toLowerCase();

    files.forEach((file) => {
      if ((file.name).includes(".gif")) {
        const fileName = file.name.split("/").pop().toLowerCase();
        const matchDistance = distance(fileName.replace(".gif", ""), tName);

        console.log(` ${fileName} vs ${tName}, Distance:${matchDistance}`);

        if (matchDistance < bestDistance) {
          bestDistance = matchDistance;
          bestMatch = file;
        }
      }
      if ((file.name).includes(".png")) {
        const fileName = file.name.split("/").pop().toLowerCase()
            .replace(" ", "");
        const matchDistance = distance(fileName.replace(".png", ""), tName);

        console.log(` ${fileName} vs ${tName}, Distance:${matchDistance}`);

        if (matchDistance < bestDistance) {
          bestDistance = matchDistance;
          bestMatch = file;
        }
      }
    });

    if (!bestMatch) {
      throw new Error("No matching image found");
    }

    console.log("fileName: ", bestMatch.metadata.name);
    return res.json({fileName: bestMatch.metadata.name});
  } catch (error) {
    console.error("Error retrieving image URL:", error);
    return res.status(404).json({error: error.message});
  }
});

exports.findAllImages = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.set("Access-Control-Allow-Methods", "GET, POST"); // Allow methods
  res.set("Access-Control-Allow-Headers", "Content-Type"); // Allow headers

  if (req.method === "OPTIONS") {
    // Handle preflight requests
    return res.status(204).send("");
  }

  const {moves, capitalChar, characterName} = req.body;
  console.log("Received parameters:", {moves, characterName, capitalChar});

  try {
    // Reference the character's directory in Firebase Storage
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({
      prefix: `${characterName}/`,
    });
    console.log("Files in bucket:", files.map((file) => file.name));

    // Create a hash map for file names
    const fileMap = new Map();
    files.forEach((file) => {
      if (file.name.includes(".gif")) {
        const fileName = file.name.split("/").pop();
        fileMap.set(fileName.replace(".gif", ""), file); // Hash map
      }
    });

    const bestMatches = [];

    // Loop through each move
    for (const moveName of moves) {
      const effectiveCharName = characterNameValidation(capitalChar, moveName);
      const targetName = `${effectiveCharName} ${moveName}`;
      let bestMatch = null;
      let bestDistance = Infinity;

      // Check in the hash map for the closest match
      for (const [fileName, file] of fileMap.entries()) {
        const matchDistance = distance(fileName, targetName);
        if (matchDistance < bestDistance) {
          bestDistance = matchDistance;
          bestMatch = file;
        }
      }

      if (bestMatch) {
        console.log("BM for move:", moveName, "is", bestMatch.metadata.name);
        bestMatches.push(bestMatch.metadata.name);
        // Optionally remove from map to avoid future checks
        fileMap.delete(bestMatch.metadata.name.replace(".gif", ""));
      } else {
        console.warn("No matching image found for move:", moveName);
      }
    }

    // Return the array of best matching file names
    return res.json({fileNames: bestMatches});
  } catch (error) {
    console.error("Error retrieving image URLs:", error);
    return res.status(404).json({error: error.message});
  }
});

/* eslint-disable-next-line require-jsdoc */
function characterNameValidation(charName, moveName) {
  if (moveName.toLowerCase().includes("luma")) {
    // Remove "Rosalina" from the start if it exists
    charName = charName.replace(/^Rosalina\s*/i, "");
    console.log(`(Luma) detected  new characterName: ${charName}`);
  }
  return charName;
}

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
