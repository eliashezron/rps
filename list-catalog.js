const catalog = "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources";

const list_catalog = async () => {
    const response = await fetch(catalog);
    const data = await response.json();
    console.log(data); 
    return data;
}

list_catalog().then(data => console.log(data)).catch(error => console.error(error));