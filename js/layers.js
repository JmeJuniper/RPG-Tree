addLayer("c", {
	name: "Coins", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#ff0",
	requires() {
		if (hasUpgrade("c", 11)) return 1
		return 0
	}, // Can be a function that takes requirement increases into account
	resource: "coins", // Name of prestige currency
	baseResource: "", // Name of resource prestige is based on
	baseAmount() {return new Decimal(1)}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: getPointGen(), // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		return new Decimal(1)
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
			tooltip: "Formula:<br>0.2",
		},
		12: {
			title: "Ooooh a promotion!",
			description: "Multiply coin gain based on xp",
			cost: new Decimal(5),
			effect() {
				return player.points.add(1).log(1.4)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
			tooltip: "Formula:<br>log1.4(XP+1)",
			unlocked() { return hasUpgrade("c", 11) }
		},
		21: {
			title: "I wonder what's in this building...",
			description: "Unlock Summons",
			cost: new Decimal(3),
			unlocked() { return hasUpgrade("c", 11) }
		},
		22: {
			title: "VIP pass",
			description: "Divide summon energy coin requirement based on your coins",
			cost: new Decimal(50),
			effect() {
				return player.c.points.root(1.4).div(5).add(1)
			},
			effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) },
			tooltip: "Formula:<br>root1.4(coins)/5+1<br>",
			unlocked() { return hasUpgrade("c", 21) }
		}
	},
	resetNothing: true,
	passiveGeneration() {
		let gain = 0
		if (hasUpgrade("c", 11)) gain += upgradeEffect("c", 11)
		if (hasUpgrade("c", 12)) gain *= upgradeEffect("c", 12)
		return gain
	},
	canReset() {return false},
	branches: ["s"],
	doReset(layer) {
	},
	tabFormat: [
	    ["main-display", 2],
		[
			"display-text",
			function() {
				return "You are gaining " + format(this.passiveGeneration) + " coins per second"
			}
		],
	    "blank",
	    "blank",
	    "upgrades",
	    "blank",
	    "blank",
	    "milestones",
	]
})

addLayer("a", {
	name: "Attack", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "Atk", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(1),
	}},
	color: "#f00",
	requires() {
		return 1
	}, // Can be a function that takes requirement increases into account
	resource: "attack", // Name of prestige currency
	baseResource: "", // Name of resource prestige is based on
	baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
	type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 1, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		return new Decimal(1)
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 0, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [],
	layerShown(){return true},
	upgrades: {},
	branches: []
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
		return 20
	}, // Can be a function that takes requirement increases into account
	resource: "summoning energy", // Name of prestige currency
	baseResource: "coins", // Name of resource prestige is based on
	baseAmount() {return player.c.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 1, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		var mult = new Decimal(1)
		if (hasUpgrade("c", 22)) mult.mult(upgradeEffect("c", 22))
		return mult
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
	layerShown(){return hasUpgrade("c", 21)},
	upgrades: {
	}
})
