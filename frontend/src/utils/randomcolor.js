export function getRandomHexColor() {
    // Generate a random integer between 0 and 16777215 (0xFFFFFF)
    const randomInt = Math.floor(Math.random() * 0xFFFFFF);
    
    // Convert to hexadecimal and pad with leading zeros if needed
    const hexColor = "#" + randomInt.toString(16).padStart(6, "0");
    
    return hexColor.toUpperCase(); // Optional: make it uppercase
}
