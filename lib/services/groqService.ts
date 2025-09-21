// This file previously contained Groq API key logic. All secrets and API key references have been removed for security.

/**
 * Converts a hex color string to an [R, G, B] array.
export const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
}
// All Groq API logic removed. Only safe utility functions remain.
