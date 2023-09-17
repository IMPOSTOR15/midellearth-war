import Modal from "./Modal";

export default class ArmyCreateModal extends Modal {
    constructor(armyData, renderArmies, modalParams) {
        super(modalParams);
        this.renderArmies = renderArmies;
        this.armyData = armyData;

        this._initializeElements(modalParams);
        this.setEventListeners();
    }

    _initializeElements(modalParams) {
        this._fillArmyRandomBtn = document.getElementById(modalParams.fillArmyBtn);
        this.army1Element = document.getElementById('army1');
        this.army2Element = document.getElementById('army2');
        this.army1raceSelect = document.getElementById('army1race');
        this.army2raceSelect = document.getElementById('army2race');
        this.maxWarriorsInput = document.getElementById('maxWarriors');
        this.warriorTypeElements = [];
    }

    createTypeElement(warrior) {
        const template = document.getElementById('wariorTypeTemplate').content.cloneNode(true);
        template.querySelector('.warrior-type_icon').src = warrior.icon;
        template.querySelector('.warrior-type_title').textContent = warrior.name;

        const attributes = {
            '#strengthAttribute': warrior.strength,
            '#armorAttribute': warrior.armor,
            '#accuracyAttribute': warrior.accuracy,
            '#speedAttribute': warrior.speed
        };

        for (const [selector, value] of Object.entries(attributes)) {
            template.querySelector(selector).querySelector('.attribute_text').textContent = value;
        }

        return template;
    }

    disableRaces(racesArray, armyId) {
        this.armyData.forEach(warrior => {
            if (warrior.army === armyId && racesArray.includes(warrior.race)) {
                warrior.isAllow = false;
            }
        });
    }

    checkRaceQuantity() {
        this.armyData.forEach(warrior => warrior.isAllow = true);
    
        const raceRestrictions = {
            'human': { disallowed: ['orc'], default: 'human' },
            'elf': { disallowed: ['orc'], default: 'human' },
            'orc': { disallowed: ['human', 'elf'], default: 'orc' }
        };
    
        const armies = [1, 2];
    
        armies.forEach(armyId => {
            const warriorsInThisArmy = this.armyData.filter(w => w.army === armyId);
            for (let warrior of warriorsInThisArmy) {
                if (warrior.quantity > 0 && raceRestrictions[warrior.race]) {
                    this.disableRaces(raceRestrictions[warrior.race].disallowed, armyId);
                    
                    const selectElement = armyId === 1 ? this.army1raceSelect : this.army2raceSelect;
                    selectElement.value = raceRestrictions[warrior.race].default;
                    break;
                }
            }
        });
    
        this.armyData.forEach(warrior => {
            const action = warrior.isAllow ? 'remove' : 'add';
            warrior.element.classList[action]('warrior-type__disabled');
        });
    }
    
    
    
    appendTypes() {
        this.armyData.forEach((warrior, warriorIndex) => {
            const currentWarrior = this.createTypeElement(warrior);

            this.armyData[warriorIndex].element = currentWarrior.querySelector('.warrior-type');

            currentWarrior.querySelector('#decreaseWarriorQuantity').addEventListener('click', (e) => {
                if (!this.armyData[warriorIndex].isAllow) return

                if (this.armyData[warriorIndex].quantity > 0) {
                    if (e.target.parentNode.parentNode.parentNode.id === "army1types") {
                        this.armyData[warriorIndex].quantity -= 1
                    }
                    if (e.target.parentNode.parentNode.parentNode.id === "army2types") {
                        this.armyData[warriorIndex].quantity -= 1
                    }
                    this.armyData[warriorIndex].element.querySelector('.warrior-type_quantity-text').textContent = this.armyData[warriorIndex].quantity

                    this.checkRaceQuantity()
                }
            });
            currentWarrior.querySelector('#increaseWarriorQuantity').addEventListener('click', (e) => {
                if (!this.armyData[warriorIndex].isAllow) return

                if (e.target.parentNode.parentNode.parentNode.id === "army1types") {
                    this.armyData[warriorIndex].quantity += 1
                }
                
                if (e.target.parentNode.parentNode.parentNode.id === "army2types") {
                    this.armyData[warriorIndex].quantity += 1
                }
                this.armyData[warriorIndex].element.querySelector('.warrior-type_quantity-text').textContent = this.armyData[warriorIndex].quantity

                this.checkRaceQuantity()

            });

            if (warrior.army === 1) {
                document.getElementById('army1types').appendChild(currentWarrior);
            }

            if (warrior.army === 2) {
                document.getElementById('army2types').appendChild(currentWarrior);
            }
        });
    }

    fillArmyRandomly(armyId, primaryRace, max_warriors) {
        let eligibleRaces;
    
        switch (primaryRace) {
            case 'human':
                eligibleRaces = ['human', 'elf', 'sorcerer'];
                break;
            case 'orc':
                eligibleRaces = ['orc', 'sorcerer'];
                break;
            default:
                console.error('Неизвестная расса:', primaryRace);
                return;
        }
    
        const eligibleWarriors = this.armyData.filter(warrior => eligibleRaces.includes(warrior.race) && warrior.army === armyId);
    
        this.armyData.forEach(warrior => {
            if (warrior.army === armyId) {
                warrior.quantity = 0;
            }
        });
    
        for (let i = 0; i < max_warriors; i++) {
            const randomWarriorIndex = Math.floor(Math.random() * eligibleWarriors.length);
            const randomWarrior = eligibleWarriors[randomWarriorIndex];
            randomWarrior.quantity += 1;
        }
    
        this.armyData.forEach(warrior => {
            if (warrior.army === armyId) {
                warrior.element.querySelector('.warrior-type_quantity-text').textContent = warrior.quantity;
            }
        });
    
        this.checkRaceQuantity();
    }


    setEventListeners() {
        this._closeBtn.addEventListener('click', () => {
            this.closeModal();
            this.renderArmies();
        });

        this._openBtn.addEventListener('click', this.openModal.bind(this));

        this._fillArmyRandomBtn.addEventListener('click', () => {
            const army1race = this.army1raceSelect.value;
            const army2race = this.army2raceSelect.value;
            const maxWarriors = this.maxWarriorsInput.value;
            this.fillArmyRandomly(1, army1race, maxWarriors);
            this.fillArmyRandomly(2, army2race, maxWarriors);
        });

        this._modal.addEventListener('click', (evt) => {
            if (evt.target === this._modal) {
                this.closeModal();
            }
        });
    }

}