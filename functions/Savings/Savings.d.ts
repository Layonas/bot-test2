import Discord from 'discord.js';
/**
 * One time use for creating the table in the database and later updating fields
 */
export function CreateSavingsStatus() : void;
export const name : string;
export const description : string;
/**
 * Updates the level on the betting player and increases their hourly, daily, weekly money gains
 * @param playerId 
 * @param msg 
 */
export function UpdateLevel(playerId : string, msg : Discord.Message) : void;
/**
 * Allows players to claim hourly, daily, weekly money and/or creates a new entry with a new player
 * @param playerId 
 * @param msg 
 */
export function Claim(playerId : string, msg : Discord.Message) : void;
/**
 * Displays player information
 * @param playerId 
 * @param msg 
 */
export function Profile(playerId : string, msg : Discord.Message) : void;
/**
 * Allows admin to give players money in case the bot was faulty
 * @param playerId 
 * @param msg 
 * @param amount 
 * @param bot 
 */
export function Give(playerId : string,  msg : Discord.Message, amount : number, bot : Discord.Client) : void;
/**
 * Allows players to tip each other money
 * @param playerId 
 * @param amount 
 * @param msg 
 */
export function Tip(playerId : string, amount : number, msg : Discord.Message) : void;
/**
 * Sends a message to the channel informing the player with their balance
 * @param playerId 
 * @param msg 
 */
export function Balance(playerId : string, msg : Discord.Message) : void;