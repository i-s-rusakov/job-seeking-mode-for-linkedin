# Development Approaches: LinkedIn Vacancy Filter

## 1. Project Overview
This project is a Tampermonkey userscript designed to filter the LinkedIn feed, hiding all posts except those advertising open vacancies (in English and Russian). 
The goal is to maintain a clean feed focused on job opportunities from connections and followed entities.

## 2. Language Policy
*   **Project Language:** All code, comments, documentation, and commit messages must be strictly in **English**.
*   **Target Languages:** The script must identify and filter vacancy-related keywords in both **English** and **Russian**.

## 3. Architecture & Implementation
*   **Environment:** Tampermonkey userscript (JavaScript).
*   **Dynamic Loading:** LinkedIn is a Single Page Application (SPA) that loads feed items dynamically. The script must utilize `MutationObserver` to detect and process new posts as they are added to the DOM.
*   **Filtering Logic:** 
    *   Instead of deleting DOM nodes (which can break React/LinkedIn's internal state), posts should be hidden using CSS (`display: none;`).
    *   Matching should be based on a robust set of regular expressions or keyword lists (e.g., "hiring", "vacancy", "looking for", "вакансия", "ищем", "найм").
*   **Performance:** The observer must be optimized to prevent excessive CPU usage (e.g., debouncing, observing only specific container elements rather than the entire `document.body`).

## 4. Testing & Debugging
*   **Logging:** All console logs should be prefixed with `[LIVF]` (LinkedIn Vacancy Filter) for easy filtering in the browser console.
*   **Debug Mode:** Implement a boolean flag `DEBUG_MODE` to toggle verbose logging. When disabled, the script should run silently.
*   **Dry-run Mode (Optional):** Consider a mode where non-vacancy posts are visually faded out (opacity: 0.2) rather than completely hidden during the development phase to verify the accuracy of the filters.

## 5. Coding Standards
*   Use modern ES6+ syntax (const/let, arrow functions, template literals).
*   Keep the code modular and well-documented.
*   Avoid global variable pollution by encapsulating logic within an Immediately Invoked Function Expression (IIFE) or using Tampermonkey's specific scopes.
