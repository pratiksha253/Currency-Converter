const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

// Populate dropdowns with currency codes
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (e) => {
        updateFlag(e.target);
    });
}

// Update country flag based on selected currency
function updateFlag(element) {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

// Fetch exchange rate and update message
async function updateExchangeRate() {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);

    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const url = `${BASE_URL}${fromCurr.value}`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let rate = data.rates[toCurr.value];

        if (!rate) {
            msg.innerText = "Currency not supported!";
            return;
        }

        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Failed to fetch exchange rate.";
        console.error("Error:", error);
    }
}

// Button click to get exchange rate
btn.addEventListener("click", (e) => {
    e.preventDefault();
    updateExchangeRate();
});

// Auto-run when page loads
window.addEventListener("load", () => {
    updateExchangeRate();
});
