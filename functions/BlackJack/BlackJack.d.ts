export class BlackJack{
    constructor();
    PlayerCards() : CardData;
    DealerCards() : CardData;
    Hit() : Card;
    cards : Array<Card>;
}    
export type CardData = {
    firstCard: Card,
    secondCard: Card
};
export type Card = {
    value: string,
    type: string
};