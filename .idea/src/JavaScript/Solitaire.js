let leftSlot = null;
let leftClass
let draggedItem = null;
//Solitaire object


var deckColor = document.createElement("img");
deckColor.src = "Images/Red_back.jpg";

const finSlots = document.querySelectorAll(".finSlot");
const cardSlots = document.querySelectorAll(".cardSlot");
const drawCard = document.querySelector(".newCardBox");
const deckClr = document.querySelector(".deckBox");
deckClr.appendChild(deckColor);

//Indexes to display start cards from.
var si1 = 1;
var si2 = 3;
var si3 = 6;
var si4 = 10;
var si5 = 15;
var si6 = 21;
var si7 = 28;

var nodeIndx = null;

var theDeck = [];
var cnti = 0;

var deckOfCards = null;
var flippedCard = null;


class Card {
    constructor(value, type){
        switch (value){
            case 1:
                this.ival = 'A';
                break;
            case 11:
                this.ival = 'J';
                break;
            case 12:
                this.ival = 'Q';
                break;
            case 13:
                this.ival = 'K';
                break;
            default:
                this.ival = value;
        }
        this.val = value;
        this.isturned = false;

        switch (type){
            case 0:
                this.typ = 'S';
                this.color = 'B';
                break;
            case 1:
                this.typ = 'H';
                this.color = 'R';
                break;
            case 2:
                this.typ = 'C';
                this.color = 'B';
                break;
            case 3:
                this.typ = 'D';
                this.color = 'R';
                break;
            default:
                this.typ = "no value";
                this.color = "no value";
        }
        this.imgStr = "Images/"+this.ival+this.typ+".jpg";
        this.image = document.createElement("img");
        this.image.addEventListener("dragstart", dragStart);
        this.image.addEventListener("dragend", dragEnd);
        if (this.isturned) {
            this.image.src = this.imgStr;
        } else {
            this.image.src = "Images/Red_back.jpg";
        }
        this.image.id = value + ":" + this.typ;
        this.id = this.image.id;
    }

}

function makeDeck() {

    var deck = [];
    for (let i = 0; i < 5; i++){
        for (let x = 1; x < 14; x++){
            deck.push(new Card(x,i));
        }
    }
    return deck;

}

function shuffle(deck) {
    for (let i = 51; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
}



//TODO, RESETTE HELE SPILLET VED NEW GAME
function startGame() {
    deckOfCards = makeDeck();
    shuffle(deckOfCards);
    for (let i = 28; i < 52; i++) {
        theDeck.push(deckOfCards[i]);
    }
    hitNew();
    let y = 0;
    for (let i = 0; i < cardSlots.length; i++){
        for (let x = i; x < cardSlots.length; x++) {
            let cs = cardSlots[x];
            cs.appendChild(deckOfCards[y].image);
            y++;
        }
    }

    for (let i = 0; i < cardSlots.length; i++){
        let cs = cardSlots[i];
        let res = findLast(cs);
        res[1].isturned = true;
        res[0].src = res[1].imgStr;
    }  //TODO, Sette bare siste element til draggable
}

//Stjeler fortsatt kort i noen tilfeller :(
function hitNew() {
    if (theDeck.length == 0){
        console.log("empty :( ");
    } else {
        if (cnti >= theDeck.length) cnti = 0;
        console.log("cnti "+cnti);
        let trndCrd = findCrdById(theDeck[cnti]);
        trndCrd.isturned = true;
        trndCrd.image.src = trndCrd.imgStr;
        drawCard.appendChild(trndCrd.image);
        cnti++;
    }
}

startGame();
deckClr.addEventListener("click", hitNew);


for (const finSlot of finSlots){
    finSlot.addEventListener('dragover', dragOver);
    finSlot.addEventListener('dragenter', dragEnter);
    finSlot.addEventListener('drop', dragDropFS);
}

for (const cardSlot of cardSlots){
    cardSlot.addEventListener('dragover', dragOver);
    cardSlot.addEventListener('dragenter', dragEnter);
    cardSlot.addEventListener('drop', dragDropCS);
}

function findLast(cardslot) {
    let lstChld = cardslot.lastChild;
    let lstcrd = deckOfCards.find(card => card.id === lstChld.id);
    return [lstChld, lstcrd];
}

function checkForFin(crdSlt, newCrd) {
    let res = findLast(crdSlt);
    let lstCrd = res[1];
    if (newCrd.typ == lstCrd.typ) {
        if (newCrd.val == lstCrd.val+1){
            return true;
        }
    }
    return false;
}

function checkIfValidNxt(crdSlt, newCrd) {
    let res = findLast(crdSlt);
    let lstCrd = res[1];
    if(lstCrd.color == 'B' && newCrd.color == 'R' || lstCrd.color == 'R' && newCrd.color == 'B') {
        if (newCrd.val == lstCrd.val-1){
            return true;
        }
    }
    return false;
}

function dragStart() {
    console.log("Started");
    draggedItem = this;
    leftClass = this.parentElement.className;
    leftSlot = this.parentElement;
}

function dragEnd() {
    console.log("Ended");
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragDropFS() {
    let drgdCrd = findCrdById(draggedItem);
    if (!this.hasChildNodes()){
        if (drgdCrd.val == 1){
            moveCard(this, draggedItem);
            this.className += " filled";
            console.log(this.className);
        }
    } else {
        if (checkForFin(this, drgdCrd)){
            moveCard(this, draggedItem);
        }
    }
}

function findCrdById(imgElm) {
    let crd = deckOfCards.find(card => card.id === imgElm.id);
    return crd;
}

function dragDropCS() {
    let newCrd = findCrdById(draggedItem);
    if(this.children.length > 0) {
        if(checkIfValidNxt(this, newCrd)) {
            moveCard(this, draggedItem);
        }
    } else {
        if (newCrd.val == 13) {
            moveCard(this, draggedItem);
            this.className = "cardSlot";
        }
    }
}

function moveCard(slot ,card) {
    let nextNode = null;
    if (card != leftSlot.lastChild) {
        console.log(false);
        nextNode = card.nextSibling;
    }
    slot.appendChild(findCrdById(card).image);
    if (leftClass == "cardSlot") {
        if (nextNode != null) {
            moveCard(slot, nextNode);
        } else {
            if (leftSlot.children.length !== 0) {
                let lstChld = findCrdById(leftSlot.lastChild);
                lstChld.isturned = true;
                lstChld.image.src = lstChld.imgStr;
            } else {
                leftSlot.className = "emptySlot";
            }
        }
    }

    if (leftClass == "newCardBox"){
        console.log("cnti "+cnti + " length " + theDeck.length);
        if (cnti == theDeck.length) {
            console.log("pop");
            theDeck.pop();
            cnti = 0;
        } else {
            console.log("cnti " + cnti + " splice");
            console.log(theDeck.length);
            cnti --;
            theDeck.splice(cnti, 1);
            console.log(theDeck.length);
        }

    }
}



