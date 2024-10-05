import { writable } from "svelte/store";
import { Checkers } from "$lib/models/checkers";

const checkers = new Checkers();

export const game = writable(checkers);
