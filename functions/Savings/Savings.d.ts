import Discord from 'discord.js';
export function CreateSavingsStatus() : void;
export const name : string;
export const description : string;
export function UpdateLevel(playerId : string, msg : Discord.Message) : void;
export function Claim(playerId : string, msg : Discord.Message) : void;