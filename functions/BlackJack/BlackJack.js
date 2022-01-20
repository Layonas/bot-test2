const { utils } = require('./utils');
class BlackJack{

    /**
     * constructor for BlackJack
     */
    constructor(){
        this.cards = [];
        utils.addToDeck(this.cards);
        utils.shuffle(this.cards);
    }

    PlayerCards(){
        return {
            firstCard: this.cards.pop(),
            secondCard: this.cards.pop()
        };
    }

    DealerCards(){
        return {
            firstCard: this.cards.pop(),
            secondCard: this.cards.pop()
        };
    }

    Hit(){
        return this.cards.pop();
    }

}

module.exports = {
    BlackJack
};
