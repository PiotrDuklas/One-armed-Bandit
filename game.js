//klasa wallet przechowuje stan środków do gry
class Wallet {
    constructor(money) {
        let _money = money; //ukryta
        //pobieranie aktualnej zawartości portfela
        this.getWalletValue = () => _money;
        //sprawdzanie czy użytkownik ma odpowiednią ilość środków do gry

        this.checkCanPlay = value => {
            if (_money >= value) return true; //ilość środków do stawki
            return false;
        }
        //zmieniamy wartość środków
        this.changeWallet = (value, type = "+") => {
            if (typeof value === "number" && !isNaN(value)) { //czy stawka jest typu number i jednocześnie nie jest NaN (jeśli jest to !)
                if (type === "+") {
                    return _money += value;
                } else if (type === "-") {
                    return _money -= value;
                } else {
                    throw new Error("nieprawidłowy typ działana") //możemy tylko zwiększać lub zmniejszać
                }
            } else {
                console.log(typeof value);
                throw new Error("nieprawidłowa wartość")
            }
        }

    }

}

// klasa statystyki
class Stats {
    constructor() {
        this.gameResults = [];
    }
    addGameToStats(win, bid) { //dodajemy grę do statystyk
        let gameResult = {
            win, //wygrana
            bid, //stawka
        }
        this.gameResults.push(gameResult) //do tablicy z wynikami dodajemy bieżącą grę
    }

    showGameStats() {
        let games = this.gameResults.length; //ilość gier to długość tablicy - ilość elementów
        let wins = this.gameResults.filter(result => result.win).length; //ilość zwycięstw
        let losses = this.gameResults.filter(result => !result.win).length; //ilość porażek
        return [games, wins, losses]

    }
}

//klasa losowanie
class Draw {
    constructor() {
        this.options = ["one", "two", "three", "four", "five", "six"]; //wstawić kości
        let _result = this.drawResult(); //wartość _result jest ukryta (niepubliczna)
        this.getDrawResult = () => _result //żeby dostać się do wartości ukrytej potrzebna jest metoda
    }
    drawResult() {
        let colors = []; //tworzymy pustą tablicę, która przechowa wyniki losowania
        for (let i = 0; i <= 2; i++) {
            const index = Math.floor(Math.random() * this.options.length);
            const color = this.options[index];
            colors.push(color); //wyniki pojedyńczych losowań dodajemy do tablicy
        }
        return colors
    }
}
//klasa wynik
class Result {
    static moneyWinInGame(result, bid) { //metoda statyczna - dostępna tylko z poziomu klasy. Czy wygrał i jaka stawka
        if (result) return 9 * bid; //jeśli wygrał to stawka razy 3
        else return 0; //jeśli przegrał to 0
    }
    static checkWinner(draw) {
        if (draw[0] === draw[1] && draw[1] === draw[2]) return true;
        else return false
    }
}

class Game {
    constructor(start) {
        this.stats = new Stats();
        this.wallet = new Wallet(start);
        document.getElementById("start").addEventListener("click", this.startGame.bind(this)); //bind utworzenie wiązania z this
        this.spanWallet = document.querySelector(".panel span.wallet"); //pobieranie elementów
        this.boards = [...document.querySelectorAll(".bone")];
        this.inputBid = document.getElementById("bid");
        this.pResult = document.querySelector(".score p.result");
        this.pGames = document.querySelector(".score p.number");
        this.pWins = document.querySelector(".score p.win");
        this.pLosses = document.querySelector(".score p.loss");

        this.render()
    }
    render(colors = ["blue", "blue", "blue"], money = this.wallet.getWalletValue(), result = "", stats = [0, 0, 0], bid = 0, wonMoney = 0) {
        this.boards.forEach((board, index) => {
            board.className = colors[index];
        })
        this.spanWallet.textContent = money;
        if (result) {
            result = `Wygrałeś ${wonMoney}`;
        } else if (!result && result !== "") {
            result = `Przegrałeś ${bid}`
        }
        this.pResult.textContent = result;
        this.pGames.textContent = `Liczba gier: ${stats[0]}`;
        this.pWins.textContent = `Zwycięstwa: ${stats[1]}`;
        this.pLosses.textContent = `Porażki: ${stats[2]}`;
        this.inputBid.value = "";

    }
    startGame() {
        if (this.inputBid.value < 1) return alert("Brak środków na grę") //trzeba użyć bind, ponieważ this stracił powiązanie z obiektem
        const bid = Math.floor(this.inputBid.value);
        if (!this.wallet.checkCanPlay(bid)) {
            return alert("Za mało środków lub wartość jest nieprawidłowa wartość")
        }
        this.wallet.changeWallet(bid, '-');
        this.draw = new Draw();
        const colors = this.draw.getDrawResult();
        const win = Result.checkWinner(colors);
        const wonMoney = Result.moneyWinInGame(win, bid);
        this.wallet.changeWallet(wonMoney);
        this.stats.addGameToStats(win, bid);
        this.render(colors, this.wallet.getWalletValue(), win, this.stats.showGameStats(), bid, wonMoney)
    }

}
const game = new Game(250)