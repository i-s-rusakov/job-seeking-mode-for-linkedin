const keywords = [
    "hiring", "vacancy", "vacancies", "job opening", "looking for a", 
    "we are looking for", "join our team", "open role", "open position",
    "вакансия", "вакансии", "ищем", "найм", "в поиске", 
    "присоединяйтесь к команде", "открыта позиция", "открытую позицию"
];

const keywordRegex = new RegExp(`(?:${keywords.join('|')})`, 'i');

const testCases = [
    { text: "Just had a great lunch with colleagues!", expected: false },
    { text: "We are hiring! Join our team as a software engineer.", expected: true },
    { text: "Check out this cool new article on AI.", expected: false },
    { text: "Открыта позиция Frontend разработчика. Пишите в ЛС.", expected: true },
    { text: "Some random post.", expected: false },
    { text: "Ищем талантливого дизайнера.", expected: true },
    { text: "We are looking for a marketing manager.", expected: true },
    { text: "Great event today!", expected: false }
];

let allPassed = true;

testCases.forEach((tc, i) => {
    const result = keywordRegex.test(tc.text);
    if (result !== tc.expected) {
        console.error(`Test ${i + 1} FAILED. Text: "${tc.text}", Expected: ${tc.expected}, Got: ${result}`);
        allPassed = false;
    } else {
        console.log(`Test ${i + 1} PASSED.`);
    }
});

if (allPassed) {
    console.log("ALL TESTS PASSED.");
} else {
    process.exit(1);
}
