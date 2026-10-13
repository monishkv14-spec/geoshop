import http from 'http';

const queries = [
  // Required Benchmark & Basic Accessories
  { q: "phone case", cat: "Accessories" },
  { q: "iphone 17 pro max case", cat: "Accessories" },
  { q: "iphone 18 pro max", cat: "Smartphones" },
  { q: "charger", cat: "Accessories" },
  { q: "type c cable", cat: "Accessories" },
  { q: "pen drive", cat: "Storage" },
  { q: "mouse", cat: "Peripherals" },
  { q: "keyboard", cat: "Peripherals" },
  { q: "power bank", cat: "Accessories" },
  { q: "earphones", cat: "Audio" },
  { q: "laptop bag", cat: "Bags" },
  { q: "water bottle", cat: "Kitchen" },
  { q: "notebook", cat: "Stationery" },
  { q: "pen", cat: "Stationery" },
  { q: "backpack", cat: "Bags" },
  { q: "running shoes", cat: "Footwear" },
  { q: "air fryer", cat: "Appliances" },
  { q: "yoga mat", cat: "Fitness" },
  { q: "dog food", cat: "Pet Supplies" },
  { q: "laptop", cat: "Computers" },
  { q: "macbook air", cat: "Computers" },
  { q: "random unknown item xyz", cat: "Fallback" },

  // Additional Common Queries across categories
  { q: "screen protector", cat: "Accessories" },
  { q: "fast charger", cat: "Accessories" },
  { q: "hdmi cable", cat: "Cables" },
  { q: "lightning cable", cat: "Cables" },
  { q: "usb cable", cat: "Cables" },
  { q: "wireless mouse", cat: "Peripherals" },
  { q: "mechanical keyboard", cat: "Peripherals" },
  { q: "sd card", cat: "Storage" },
  { q: "ssd 1tb", cat: "Storage" },
  { q: "external hard drive", cat: "Storage" },
  { q: "webcam 1080p", cat: "Peripherals" },
  { q: "laptop stand", cat: "Accessories" },
  { q: "cooling pad", cat: "Accessories" },
  { q: "usb c hub", cat: "Accessories" },
  { q: "wifi router", cat: "Networking" },
  { q: "extension board", cat: "Electrical" },
  { q: "gaming headset", cat: "Audio" },
  { q: "bluetooth speaker", cat: "Audio" },
  { q: "smart watch", cat: "Wearables" },
  { q: "fitness band", cat: "Wearables" },
  { q: "desk lamp", cat: "Lighting" },
  { q: "led bulb", cat: "Lighting" },
  { q: "thermal flask", cat: "Kitchen" },
  { q: "lunch box", cat: "Kitchen" },
  { q: "coffee mug", cat: "Kitchen" },
  { q: "sunglasses", cat: "Fashion" },
  { q: "leather wallet", cat: "Fashion" },
  { q: "cotton t-shirt", cat: "Fashion" },
  { q: "face wash", cat: "Beauty" },
  { q: "sunscreen spf 50", cat: "Beauty" },
  { q: "shampoo", cat: "Personal Care" },
  { q: "dumbbell set", cat: "Fitness" },
  { q: "stapler", cat: "Stationery" },
  { q: "scientific calculator", cat: "Stationery" },
  { q: "screwdriver set", cat: "Tools" },
  { q: "car phone mount", cat: "Automotive" },
  { q: "cat food", cat: "Pet Supplies" },
  { q: "extra virgin olive oil", cat: "Grocery" },

  // Typos and Concatenated queries
  { q: "iphone17", cat: "Typo / Concatenated" },
  { q: "samsng", cat: "Typo" },
  { q: "waterbottle", cat: "Typo / Concatenated" },
  { q: "pendrive", cat: "Typo / Concatenated" },
  { q: "earfones", cat: "Typo" }
];

function fetchSearch(query) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function runAudit() {
  const results = [];
  let passCount = 0;
  let failCount = 0;

  for (const item of queries) {
    try {
      const res = await fetchSearch(item.q);
      const count = res.data ? res.data.length : 0;
      const pass = count > 0;
      if (pass) passCount++;
      else failCount++;
      results.push({
        query: item.q,
        category: item.cat,
        resultsCount: count,
        status: pass ? 'PASS' : 'FAIL',
        matchedNames: res.data ? res.data.map(p => p.name).slice(0, 2).join(', ') : ''
      });
    } catch (e) {
      failCount++;
      results.push({
        query: item.q,
        category: item.cat,
        resultsCount: 0,
        status: 'ERROR',
        matchedNames: e.message
      });
    }
  }

  console.log(JSON.stringify({ passCount, failCount, total: queries.length, results }, null, 2));
}

runAudit();
