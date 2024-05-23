import { atom } from "jotai";

export const store = atom({
	text: "ico",
	textColor: {
		hex: "#000",
		red: 0,
		green: 0,
		blue: 0,
		alpha: 100,
	},
	fontSize: 178,
	rotation: 0,
	borderWidth: 9,
	rounded: 94,
	border: {
		color: {
			hex: "#000",
		},
	},
	bgColor: {
		hex: "#fff",
		red: 0,
		green: 0,
		blue: 0,
		alpha: 100,
	},
});
