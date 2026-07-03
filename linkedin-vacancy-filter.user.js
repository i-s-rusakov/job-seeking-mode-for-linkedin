// ==UserScript==
// @name         LinkedIn Vacancy Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide non-vacancy posts from LinkedIn feed
// @author       You
// @include      *://*.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_addStyle
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';
    console.warn('[LIVF] TOP LEVEL SCRIPT EXECUTION STARTED! If you see this, Tampermonkey is working.');

    const DEBUG_MODE = true; // Set to false to disable console logs

    // Inject CSS for the collapsible posts
    GM_addStyle(`
        .livf-collapsed {
            max-height: 100px !important;
            overflow: hidden !important;
            position: relative !important;
            cursor: pointer !important;
            opacity: 0.6 !important;
            transition: opacity 0.2s ease !important;
        }
        .livf-collapsed:hover {
            opacity: 1 !important;
        }
        .livf-collapsed::after {
            content: "Post hidden (click to expand)";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to bottom, transparent, #f3f2ef 40%, #f3f2ef 100%);
            color: #0a66c2;
            text-align: center;
            font-weight: 600;
            font-size: 13px;
            padding: 20px 10px 5px 10px;
            pointer-events: none;
            border-bottom: 1px solid #e0dfdc;
        }
        [data-livf-listener="true"] {
            position: relative;
        }
        .livf-collapse-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ffffff;
            color: #0a66c2;
            border: 1px solid #0a66c2;
            border-radius: 16px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            z-index: 100;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: background 0.2s;
        }
        .livf-collapse-btn:hover {
            background: #f3f2ef;
        }
        .livf-collapsed .livf-collapse-btn {
            display: none !important;
        }
    `);

    const log = (...args) => {
        if (DEBUG_MODE) {
            console.warn('[LIVF]', ...args);
        }
    };

    // English and Russian vacancy keywords/phrases
    const keywords = [
        "hiring", "vacancy", "vacancies", "job opening", "opening", "looking for a", 
        "we are looking for", "join our team", "open role", "open position",
        "вакансия", "вакансии", "ищем", "найм", "в поиске", 
        "присоединяйтесь к команде", "открыта позиция", "открытую позицию", "Jobs recommended for you"
    ];

    // Create a single regex for performance, case-insensitive
    const keywordRegex = new RegExp(`(?:${keywords.join('|')})`, 'i');

    // Negative keywords: if these are present, the post is rejected even if it has vacancy keywords
    const negativeKeywords = [
        "поискработы", "поиск работы", "ищу работу", "opentowork", "open to work", 
        "looking for a job", "looking for work", "personal branding", "персональный бренд", "BusinessOpportunity"
    ];
    const negativeRegex = new RegExp(`(?:${negativeKeywords.join('|')})`, 'i');

    const processedPosts = new WeakSet();

    const processPost = (postNode) => {
        if (processedPosts.has(postNode)) return;
        processedPosts.add(postNode);

        // LinkedIn feed items usually have the 'data-urn' attribute or specific classes like 'feed-shared-update-v2'
        // For robustness, we check the innerText of the post
        const textContent = postNode.innerText || postNode.textContent || '';
        
        if (!textContent.trim()) {
             // Some wrapper nodes might be empty initially
             processedPosts.delete(postNode); 
             return;
        }

        // Remove '#' to easily catch hashtags like #OpenToWork
        const cleanText = textContent.replace(/#/g, '');
        const isVacancy = keywordRegex.test(cleanText) && !negativeRegex.test(cleanText);

        // Setup listener and collapse button for ALL posts if not already done
        if (!postNode.hasAttribute('data-livf-listener')) {
            postNode.setAttribute('data-livf-listener', 'true');
            
            const collapseBtn = document.createElement('div');
            collapseBtn.className = 'livf-collapse-btn';
            collapseBtn.innerHTML = 'Collapse ↑';
            collapseBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                postNode.classList.add('livf-collapsed');
                // Scroll back to the post if user scrolled down to read it
                postNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };
            postNode.appendChild(collapseBtn);

            postNode.addEventListener('click', (e) => {
                if (postNode.classList.contains('livf-collapsed')) {
                    e.preventDefault();
                    e.stopPropagation();
                    postNode.classList.remove('livf-collapsed');
                }
            }, true); // Use capture phase to intercept clicks before LinkedIn does
        }

        if (isVacancy) {
            log('Vacancy found:', textContent.substring(0, 50).replace(/\n/g, ' ') + '...');
            postNode.classList.remove('livf-collapsed');
            postNode.style.border = '2px solid #057642'; // Highlight valid vacancy with LinkedIn green
        } else {
            // Not a vacancy, force collapse state initially
            postNode.classList.add('livf-collapsed');
            postNode.style.border = 'none';
        }
    };

    const processFeed = () => {
        // LinkedIn obfuscates CSS classes, so we rely on accessibility headers
        const h2s = document.querySelectorAll('h2');
        const posts = [];
        for (const h2 of h2s) {
            const text = (h2.textContent || '').toLowerCase();
            if (text.includes('feed post') || text.includes('пост в ленте') || text.includes('пост')) {
                // Find the true outermost container of the post.
                // In the main feed, it usually has role="listitem".
                let container = h2.closest('[role="listitem"]');
                
                if (!container) {
                    // Fallback to the immediate parent
                    container = h2.parentElement;
                    // Try to walk up if wrapped in a display-contents React fragment that also holds comments
                    if (container && container.parentElement && container.parentElement.getAttribute('data-display-contents') === 'true') {
                        if (container.parentElement.parentElement) {
                            container = container.parentElement.parentElement;
                        }
                    }
                }
                
                if (container && !posts.includes(container)) {
                    posts.push(container);
                }
            }
        }
        posts.forEach(processPost);
    };

    // Set up MutationObserver to catch new posts as they are loaded
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // To avoid processing too often, we just flag that we need to process
                // checking if added nodes might contain feed items
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            // Debounce processing slightly to batch DOM updates
            clearTimeout(window.feedProcessTimeout);
            window.feedProcessTimeout = setTimeout(processFeed, 200);
        }
    });

    // Wait for the feed container to load before observing
    const init = () => {
        const feedContainer = document.querySelector('.scaffold-layout__main') || document.body;
        
        if (feedContainer) {
            log('Starting observer on feed container');
            observer.observe(feedContainer, { childList: true, subtree: true });
            // Initial run for posts already in the DOM
            processFeed();
        } else {
            log('Feed container not found, retrying in 1s...');
            setTimeout(init, 1000);
        }
    };

    // Delay start slightly to allow SPA to initialize
    setTimeout(init, 2000);
})();
