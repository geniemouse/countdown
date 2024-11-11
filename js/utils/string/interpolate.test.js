import { describe, expect, mock, spyOn, test } from "bun:test";
import { interpolate } from "./interpolate.js";

const DATA = {
	name: "Paddington Bear",
	origin: "Darkest Peru",
	creator: "Michael Bond",
	favourite: {
		food: "marmalade",
		skill: "Hard stare",
	},
};

test("File successfully imported & module exports as expected", () => {
	expect(typeof interpolate).toBe("function");
});

test("Calling interpolate without parameters returns an empty string", () => {
	expect(interpolate()).toEqual("");
});

test("Replaces property names (referenced in template string) with correct values", () => {
	expect(
		interpolate("My name is ${name}, I was created by ${creator}", DATA),
	).toEqual("My name is Paddington Bear, I was created by Michael Bond");
});
