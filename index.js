
const CONFIG = {
    EVENTS: {
        RANGE: 'Sheet1!A2:D11',
        API_KEY: 'AIzaSyBGA3A74_77EnkBXysT96UYYHzFsCem7io',
        SPREADSHEET_ID: '1dlFOGibQcuWcYqi1QehbMb2FI-nTnKT8iN551YaBPjo',
    },
    STRIPE: {
        API_KEY: 'pk_test_np03HQCRSso2O8NqYEGVlzAu00dkOZkCxf',
    },
};

let urls = {
    cancelUrl: `${window.location.href}/cancel.html`,
    successUrl: `${window.location.href}/success.html`,
};

let stripe = Stripe(CONFIG.STRIPE.API_KEY);

let rowToObject = (row) => {
    const [sku, title, price, description] = row;
    return {sku, title, price, description};
};

let fetchEvents = () => {
    const {RANGE, API_KEY, SPREADSHEET_ID} = CONFIG.EVENTS;
    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`)
        .then(r => r.json())
        .then(r =>r.values.map(rowToObject));
};

let redirectToFriendsOfStMaryPlan = () =>
    stripe.redirectToCheckout({
            ...urls,
            items: [{plan: 'plan_FfbjMilRMvU9NZ', quantity: 1}],
    });

let renderEventWidget = (row) => {
    let buy = document.createElement('button');
    buy.className = 'btn btn-primary';
    buy.innerHTML = `Buy now! For only ${row.price}`;
    buy.onclick = () =>
        stripe.redirectToCheckout({...urls, items: [{sku: row.sku, quantity: 1}]});

    let title = document.createElement('h3');
    title.innerText = row.title;

    let description = document.createElement('p');
    description.innerText = row.description;

    let group =  document.createElement('div');
    group.appendChild(title);
    group.appendChild(description);
    group.appendChild(buy);

    return group;
};

let renderEvents = (container) =>
    fetchEvents()
        .then(e => e.map(renderEventWidget))
        .then(e => e.forEach(div => container.appendChild(div)));
