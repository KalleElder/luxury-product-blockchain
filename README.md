# Luxury Product Blockchain

Ett Node.js-baserat REST API för digitala produktpass och ägarbyten av lyxprodukter.

Projektet använder en blockkedja med Proof-of-Work för att skapa en verifierbar historik över produkter och deras ägare. Tanken är att motverka förfalskningar genom att varje produkt får ett unikt digitalt produktpass.

## Scenario

Projektet bygger på scenariot med lyxprodukter.

En produkt registreras med ett unikt `productId` och en första ägare. När produkten byter ägare registreras ägarbytet som en ny transaktion.

Systemet kontrollerar vem som är produktens nuvarande ägare innan ett ägarbyte godkänns.

Exempel:

- Alice äger `watch-001`
- Alice kan överföra produkten till Bob
- Charlie kan inte överföra produkten eftersom han inte är den registrerade ägaren

## Tekniker

- Node.js
- Express
- Node.js `crypto`
- Vitest
- Supertest
- REST API
- SHA-256
- Proof-of-Work

## Installation

Klona repot:

```bash
git clone https://github.com/KalleElder/luxury-product-blockchain.git
cd luxury-product-blockchain
```

Installera dependencies:

```bash
npm install
```

## Starta servern

```bash
npm start
```

Servern körs som standard på:

```text
http://localhost:3000
```

Det går även att välja en annan port med miljövariabeln `PORT`:

```bash
PORT=3001 npm start
```

## Tester

Kör alla tester:

```bash
npm test
```

Projektet har enhetstester för blockkedjan och integrationstester för Express-API:t.

Senaste testresultatet:

```text
Test Files  2 passed
Tests       16 passed
```

## Coverage

Kör coverage med:

```bash
npm run coverage
```

Senaste resultatet:

```text
Statements : 95.78 %
Branches   : 88.23 %
Functions  : 100 %
Lines      : 95.74 %
```

## Proof-of-Work

Blockkedjan använder SHA-256 genom den inbyggda `crypto`-modulen i Node.js.

Vid mining ändras blockets `nonce` tills blockets hash börjar med rätt antal nollor.

Under test används lägre svårighetsgrad:

```js
this.difficulty = process.env.NODE_ENV === 'test' ? 1 : 2
```

Det gör testerna snabbare samtidigt som vanlig körning använder en högre svårighetsgrad.

## Block

Ett block innehåller bland annat:

```json
{
  "index": 1,
  "timestamp": 123456789,
  "transactions": [],
  "previousHash": "0",
  "nonce": 42,
  "hash": "00abc..."
}
```

Varje block pekar på föregående block genom `previousHash`.

## State validation

Systemet kontrollerar state innan ett ägarbyte tillåts.

För att genomföra en transfer måste värdet i `from` vara samma som produktens nuvarande ägare enligt blockkedjan.

Om fel person försöker överföra produkten returnerar API:t ett fel:

```text
Avsändaren är inte produktens nuvarande ägare
```

Systemet kontrollerar också att samma `productId` inte registreras flera gånger.

## Verifiering och immutability

Metoden `isChainValid()` verifierar blockkedjan genom att:

1. räkna om varje blocks hash
2. jämföra den med blockets sparade hash
3. kontrollera att `previousHash` stämmer med föregående block

Om innehållet i ett redan minat block ändras kommer den beräknade hashen inte längre att matcha den sparade hashen.

På så sätt kan manipulation av historiken upptäckas.

## API

### GET /blockchain

Returnerar hela blockkedjan och väntande transaktioner.

```bash
curl http://localhost:3000/blockchain
```

### POST /products

Registrerar ett nytt digitalt produktpass.

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "watch-001",
    "name": "Luxury Watch",
    "owner": "Alice"
  }'
```

Obligatoriska fält:

- `productId`
- `name`
- `owner`

### POST /mine

Minar väntande transaktioner till ett nytt block.

```bash
curl -X POST http://localhost:3000/mine
```

### POST /transfers

Registrerar ett ägarbyte.

```bash
curl -X POST http://localhost:3000/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "watch-001",
    "from": "Alice",
    "to": "Bob"
  }'
```

Obligatoriska fält:

- `productId`
- `from`
- `to`

Avsändaren måste vara produktens nuvarande ägare.

### GET /products/:productId

Returnerar produktens nuvarande ägare och registrerade historik.

```bash
curl http://localhost:3000/products/watch-001
```

Exempel:

```json
{
  "productId": "watch-001",
  "currentOwner": "Bob",
  "history": [
    {
      "type": "REGISTER",
      "productId": "watch-001",
      "name": "Luxury Watch",
      "owner": "Alice"
    },
    {
      "type": "TRANSFER",
      "productId": "watch-001",
      "from": "Alice",
      "to": "Bob"
    }
  ]
}
```

### GET /verify

Kontrollerar om blockkedjan är giltig.

```bash
curl http://localhost:3000/verify
```

Exempel:

```json
{
  "valid": true
}
```

## TDD

Projektet har utvecklats stegvis med tester för bland annat:

- SHA-256-hashning
- Proof-of-Work
- genesis-block
- produktregistrering
- mining av transaktioner
- state validation
- ogiltiga ägarbyten
- verifiering av blockkedjan
- REST API
- produktvalidering
- digitala produktpass

Vitest används för tester och Supertest används för integrationstester av REST-API:t.

## Projektstruktur

```text
luxury-product-blockchain/
├── src/
│   ├── middleware/
│   │   ├── validateProduct.js
│   │   └── validateTransfer.js
│   ├── Blockchain.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── api.test.js
│   └── blockchain.test.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```
