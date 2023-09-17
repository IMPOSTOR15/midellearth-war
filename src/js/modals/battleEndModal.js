import Modal from "./Modal";

export default class BattleEndModal extends Modal {
    constructor(modalParams) {
        super(modalParams);
        this.setEventListeners();
    }

    setWinner(armyNum, armyWarriors) {
        const aliveWarriorsWrapper = this._modalContent.querySelector('#alliveWarriors');
        aliveWarriorsWrapper.innerHTML = '';

        this._modalContent.querySelector('#winArmyNum').textContent = armyNum;

        armyWarriors.forEach(warrior => {
            if (warrior.alive) {
                aliveWarriorsWrapper.appendChild(warrior.warriorArmyElement.cloneNode(true));
            }
        });
    }

    setEventListeners() {
        this._closeBtn.addEventListener('click', () => this.closeModal());

        this._modal.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }
}