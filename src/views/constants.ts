export const symbolHeaders = [
  {
    text: 'Ticker',
    align: 'left',
    sortable: false,
    value: 'ticker',
  },
  {
    text: 'Bid',
    align: 'left',
    sortable: false,
    value: 'bid',
  },
  {
    text: 'Ask',
    align: 'left',
    sortable: false,
    value: 'ask',
  },
  {
    text: 'Actions',
    align: 'left',
    sortable: false,
    value: 'actions',
  },
];

// export const orderHeaders = [
//   { text: 'State', value: 'state' },
//   { text: 'Ticker', value: 'ticker' },
//   { text: 'Type', value: 'type' },
//   { text: 'Side', value: 'side' },
//   { text: 'Quantity', value: 'quantity' },
//   { text: 'Time', value: 'time' },
// ];

export const orderHeaders = [
  { text: 'Id', value: 'id' },
  { text: 'Symbol', value: 'symbol' },
  { text: 'State', value: 'state' },
  { text: 'Type', value: 'type' },
  { text: 'Leaves', value: 'leaves' },
  { text: 'Side', value: 'side' },
  { text: 'Price', value: 'price' },
  { text: 'Volume', value: 'volume' },
  { text: 'Time', value: 'time' },
];

export const positionHeaders = [
  { text: 'Ticker', value: 'ticker' },
  { text: 'Position', value: 'position' },
  { text: 'Avg.Price', value: 'avgprice' },
  { text: 'Price', value: 'price' },
  { text: 'P&L', value: 'pnl' },
];
