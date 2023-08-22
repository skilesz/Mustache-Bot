module.exports = [ {
  category: 'Wood',
  items: [ 'Oak', 'Dark Oak', 'Spruce', 'Birch', 'Jungle', 'Acacia', 'Mangrove' ],
  forms: [ 'Logs', 'Planks' ],
  itemsPerUnit: 64,
  pricePerUnit: 20,
  currency: 'Iron'
}, {
  category: 'Stone',
  items: [ 'Smoothstone', 'Cobblestone', 'Bricks (block)', 'Stone Bricks' ],
  itemsPerUnit: 32,
  pricePerUnit: 15,
  currency: 'Iron'
}, {
  category: 'Materials',
  items: [ {
    name: 'Bricks (item)',
    itemsPerUnit: 64,
    pricePerUnit: 2,
    currency: 'Iron'
  }, {
    name: 'Clay',
    itemsPerUnit: 32,
    pricePerUnit: 1,
    currency: 'Iron'
  }, {
    name: 'Redstone Dust',
    itemsPerUnit: 32,
    pricePerUnit: 5,
    currency: 'Gold'
  }, {
    name: 'Glowstone Dust',
    itemsPerUnit: 32,
    pricePerUnit: 5,
    currency: 'Gold'
  } ],
} ];