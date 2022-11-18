addLayer("c", {
	name: "Coins", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#ff0",
	requires: function() {
		if (hasUpgrade("c", 11)) return 1
		return 0
	}, // Can be a function that takes requirement increases into account
	resource: "coins", // Name of prestige currency
	baseResource: "", // Name of resource prestige is based on
	baseAmount() {return new Decimal(1)}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: getPointGen(), // Prestige currency exponent
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
			effect() {
				return new Decimal(0.2)
			},
			cost: new Decimal(0),
			tooltip: "Gain 0.2 coins per second",
		},
		12: {
			title: "Ooooh a promotion!",
			description: "Multiply coin gain based on xp",
			cost: new Decimal(5),
			effect() {
				return player.points.add(1).log(1.4)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
			tooltip: "Multiplies cps by [ log1.4(XP+1) ]",
		},
		21: {
			title: "I wonder what's in this building...",
			description: "Unlock Summons",
			cost: new Decimal(3),
			tooltip: "Unlock new layer \"Summons\"",
		},
		22: {
			title: "VIP pass",
			description: "Cheaper summons based on your coins",
			cost: new Decimal(50),
			effect() {
				return player.c.points.root(1.4).div(5)
			},
			effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) },
			tooltip: "Summon coin requirement is divided by [ root1.4(coins)/5 ]",
		}
	},
	resetNothing: true,
	passiveGeneration() {
		var gain = 0
		if (hasUpgrade("c", 11)) gain += upgradeEffect("c", 11)
		if (hasUpgrade("c", 12)) gain *= upgradeEffect("c", 12)
		return gain
	},
	canReset() {return false},
	branches: ["s"],
	doReset(layer) {
		layerDataReset(this.layer, ["best", "total", "upgrades"])
	}
})

addLayer("s", {
	name: "Summons", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#707",
	requires: function() {
		var req = new Decimal(20)
		if (hasUpgrade("c", 22)) req.div(upgradeEffect("c", 22))
		return req
	}, // Can be a function that takes requirement increases into account
	resource: "summoning energy"+upgradeEffect("c", 22), // Name of prestige currency
	baseResource: "coins", // Name of resource prestige is based on
	baseAmount() {return player.c.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 1, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		return new Decimal(1)
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{
			key: "s", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
			description: "S: Purchase Summoning Energy", // The description of the hotkey that is displayed in the game's How To Play tab
			onPress() { doReset(this.layer) },
			unlocked() {return player[this.layer].unlocked} // Determines if you can use the hotkey, optional
		}
	],
	layerShown(){return true},
	upgrades: {
	}
})
