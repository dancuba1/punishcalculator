

export function capitaliseFirstLetter(string) {
    if (string.length === 0) return string; // Handle empty string case
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowercaseFirstLetter(str) {
    if (!str) return str; // Check if the string is empty or undefined
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function removeAllParentheses(str) {
    // Use a regular expression to remove parentheses but keep their contents
    return str.replace(/\(([^()]+)\)/g, '$1');
}

export function removeSpecialSubstrings(str) {
    // Define an array of substrings to remove
    const substringsToRemove = ["Neutral B ", "Side B ", "Up B ", "Down B "];
    
    // Use a loop to remove each substring
    substringsToRemove.forEach(substring => {
        // Replace all occurrences of the substring with an empty string
        str = str.replaceAll(substring, '');
    });

    if (str.toLowerCase().includes("end")) {
        str = str.replaceAll(/end/gi, 'Finisher'); // 'gi' makes it case-insensitive
        }
        if (str.toLowerCase().includes("fire bird")) {
        str = str.replaceAll(/fire bird/gi, 'Firebird'); // 'gi' makes it case-insensitive
        }
    
    return str;
}

export const transformId = (id) => {
    return id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

export const removeUnderscore = (id) => {
    return id
    .split('_')
}