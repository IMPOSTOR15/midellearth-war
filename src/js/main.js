import '../assets/styles/index.css'

import Human from './warriors/human';
import Orc from './warriors/orc';
import Sorcerer from './warriors/Sorcerer'
import Elf from './warriors/elf';

import ArmyCreateModal from './modals/armyCreateModal';

import { warriorsData } from './consts'

import battleEndModal from './modals/battleEndModal';

import BattleLog from './BattleLog';

BattleLog.loadLogsFromLS()

const startBattleBtn = document.getElementById('startBattleBtn')

const army1Div = document.getElementById('army1');
const army2Div = document.getElementById('army2');
const battleProcessElement = document.getElementById('battleInfo');

const opponent1Div = document.getElementById('opponent1')
const opponent2Div = document.getElementById('opponent2')
const wictoryElement = document.createElement('span')

let army1 = [];
let army2 = [];

const createArmy = function(data, armyArr, armyNum) {
    const warriorMap = {
        sorcerer: { class: Sorcerer, name: 'Чародей' },
        elf: { class: Elf, name: 'Эльф' },
        human: {
            Footman: { class: Human, name: 'Пехотинец' },
            Cavalry: { class: Human, name: 'Всадник' }
        },
        orc: {
            Light: { class: Orc, name: 'Легкий орк' },
            Heavy: { class: Orc, name: 'Тяжелый орк' }
        }
    };

    const warriorCounts = {};

    data.forEach((warrior) => {
        if (warrior.quantity > 0 && armyNum === warrior.army) {
            let warriorInfo;
            if (warrior.type && warriorMap[warrior.race] && warriorMap[warrior.race][warrior.type]) {
                warriorInfo = warriorMap[warrior.race][warrior.type];
            } else {
                warriorInfo = warriorMap[warrior.race];
            }

            if (!warriorInfo) return;

            const { class: WarriorClass, name } = warriorInfo;

            for (let i = 0; i < warrior.quantity; i++) {
                const key = warrior.type ? `${warrior.race}.${warrior.type}` : warrior.race;
                warriorCounts[key] = (warriorCounts[key] || 0) + 1;
                const warriorName = `${name} ${warriorCounts[key]}`;
                if (warrior.type) {
                    armyArr.push(new WarriorClass(
                        warriorName,
                        warrior.strength,
                        warrior.speed,
                        warrior.accuracy,
                        warrior.armor,
                        warrior.type,
                        warrior.army
                    ));
                } else {
                    armyArr.push(new WarriorClass(
                        warriorName,
                        warrior.strength,
                        warrior.speed,
                        warrior.accuracy,
                        warrior.armor,
                        warrior.army
                    ));
                }
            }
        }
    });
};




const initialArmyCreate = function() {
    army1 = []
    army2 = []

    createArmy(warriorsData, army1, 1)
    createArmy(warriorsData, army2, 2)

    army1Div.innerHTML = '';
    army2Div.innerHTML = '';

    army1.forEach(warrior => {
        army1Div.appendChild(warrior.render());
    });
    
    army2.forEach(warrior => {
        army2Div.appendChild(warrior.render());
    });
}

startBattleBtn.addEventListener('click', () => {
    startBattle()
})

const ArmyCreateModalController = new ArmyCreateModal(warriorsData, initialArmyCreate, {
    modalId: 'modal',
    modalContent: 'armyCreateModal',
    openBtnId: 'armySettingsBtn',
    closeBtnId: 'closeModalBtn',
    fillArmyBtn: 'fillArmyRandom',
})

const BattleEndModalController = new battleEndModal( {
    modalId: 'modal',
    modalContent: 'batleEndModal',
    closeBtnId: 'closeModalBtn',
})

ArmyCreateModalController.appendTypes()

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomOpponent(army) {
    const aliveWarriorsArr = army.filter(soldier => soldier.alive);
    const index = Math.floor(Math.random() * aliveWarriorsArr.length);
    return army[army.indexOf(aliveWarriorsArr[index])];
}

function hasAliveWarriors(army) {
    return army.some(warrior => warrior.alive === true);
}

function checkAndCorrectWarriorSide() {
    for (let i = 0; i < army1.length; i++) {
        const warrior = army1[i];
        if (warrior.side !== 1) {
            army2.push(warrior);
            if (army1Div.contains(warrior.warriorArmyElement)) {
                army1Div.removeChild(warrior.warriorArmyElement)
            }
            if (!army2Div.contains(warrior.warriorArmyElement)) {
                army2Div.appendChild(warrior.warriorArmyElement)
            }
            
            army1.splice(i, 1);
            i--;
        }
    }
    for (let j = 0; j < army2.length; j++) {
        const warrior = army2[j];
        if (warrior.side !== 2) {
            army1.push(warrior);
            if (army2Div.contains(warrior.warriorArmyElement)) {
                army2Div.removeChild(warrior.warriorArmyElement)
            }
            if (!army1Div.contains(warrior.warriorArmyElement)) {
                army1Div.appendChild(warrior.warriorArmyElement)
            }
            army2.splice(j, 1);
            j--;
        }
    }
}

function findNextAliveWarrior(army, startIndex) {
    for (let i = startIndex; i < army.length; i++) {
        if (army[i].alive) {
            return army[i];
        }
    }
}


let oneTurnDurationMs = 1200
let isBattle = false

const startBattle = function() {
    if (isBattle || !hasAliveWarriors(army1) || !hasAliveWarriors(army2)) {
        console.log('битва уже идет или кончилась');
        return;
    }
    BattleLog.addBattleLog('Битва началась!', 'startBattle');
    if (battleProcessElement.contains(wictoryElement)) {
        battleProcessElement.removeChild(wictoryElement);
    }

    army1 = shuffle(army1);
    army2 = shuffle(army2);
    console.log(army1, army2);
    isBattle = true;
    let currentSoldierIndex = 0;
    let turn = 0;

    const battleSequence = function() {
        const maxLength = Math.max(army1.length, army2.length);
        const isArmy1Alive = hasAliveWarriors(army1);
        const isArmy2Alive = hasAliveWarriors(army2);

        if (!isArmy1Alive || !isArmy2Alive) {
            const winningArmy = isArmy1Alive ? army1 : army2;
            const winArmyNum = isArmy1Alive ? 1 : 2;
            BattleEndModalController.setWinner(winArmyNum, winningArmy);
            BattleEndModalController.openModal();
            BattleLog.addBattleLog(`Битва окончена! Победила ${isArmy1Alive ? "первая" : "вторая"} армия`, 'endBattle');
            BattleLog.saveLogsToLS();
            isBattle = false;
            return;
        }

        checkAndCorrectWarriorSide();

        if (currentSoldierIndex >= maxLength) currentSoldierIndex = 0;

        const currentWarriorArmy1 = findNextAliveWarrior(army1, currentSoldierIndex);
        const currentWarriorArmy2 = findNextAliveWarrior(army2, currentSoldierIndex);

        if (!(currentWarriorArmy1?.alive && currentWarriorArmy2?.alive)) {
            currentSoldierIndex++;
            setTimeout(battleSequence, 0);
            return;
        }

        const opponent = (turn === 0) 
            ? getRandomOpponent(army2)
            : getRandomOpponent(army1);

        if (opponent?.alive) {
            if (turn === 0) attackWarrior(currentWarriorArmy1, opponent);
            else attackWarrior(currentWarriorArmy2, opponent);
            turn = 1 - turn; 
        }

        currentSoldierIndex++;
        setTimeout(battleSequence, oneTurnDurationMs);
    };

    battleSequence();
};

function moveWarriorElement(warrior, fromDiv, toDiv) {
    if (fromDiv.contains(warrior.warriorArmyElement)) {
        fromDiv.removeChild(warrior.warriorArmyElement);
    }
    toDiv.appendChild(warrior.warriorArmyElement);
}

function attackWarrior(attacker, defender) {
    if (!defender) return;

    moveWarriorElement(attacker, (attacker.side === 1 ? army1Div : army2Div), opponent1Div);
    moveWarriorElement(defender, (defender.side === 1 ? army1Div : army2Div), opponent2Div);

    setTimeout(() => {
        attacker.attack(defender);

        setTimeout(() => {
            moveWarriorElement(attacker, opponent1Div, (attacker.side === 1 ? army1Div : army2Div));
            moveWarriorElement(defender, opponent2Div, (defender.side === 1 ? army1Div : army2Div));
        }, oneTurnDurationMs / 3);
    }, oneTurnDurationMs / 3);
}



