class utils{

    static addToDeck(cards) {
        
        const c = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const t = ["Spades", "Diamonds", "Clubs", "Hearts"];

        for(let char in c)
            for(let type in t){
                const card = {
                            value: c[char],
                            type: t[type]
                        };
                cards.push(card);
            }
                

        return cards;
    }

    static shuffle(cards){

        for(let i = cards.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * i);
            let temp  = cards[i];
            cards[i] = cards[j];
            cards[j] = temp;
        }

        return cards;
    }
}

module.exports = {
    utils
};