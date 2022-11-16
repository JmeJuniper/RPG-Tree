addLayer("p", {
	name: "Coins", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
    }},
	color: "#4BDC13",
	requires: function() {return player.points.add(1000)}, // Can be a function that takes requirement increases into account
	resource: "prestige points", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() {return player.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 999, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 0, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [],
	layerShown(){return true},
	upgrades: {
		11: {
			title: "Work or smth idk",
			description: "Get a bit of coin gain",
			cost: new Decimal(0)
		}
	}
})
