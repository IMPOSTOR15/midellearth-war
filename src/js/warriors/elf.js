import Warrior from "./warrior";
import elfIcon from '../../assets/icons/warriors/elf.svg'
import elfSkullIcon from '../../assets/icons/warriors/elf_skull.svg'

import BattleLog from '../BattleLog'

export default class Elf extends Warrior {
    constructor(name, strength, speed, accuracy, armor, army) {
        super(name, 'elf', strength, speed, accuracy, armor, elfIcon, army);
    }

    attack(target) {
        target.getAtacked('arrow');
        
        if (Math.random() > 0.7) { // 30% chance to hit the eye
            BattleLog.addBattleLog(`${this.name} из армии ${this.side} попал в глаз ${this.correctNamesInText(target.name, 'genitive')} из армии ${target.side}!`);
            target.alive = false;
            target.armor = 0;
            target.dead();
            this.updateWarriorCard();
            target.updateWarriorCard();
            BattleLog.addBattleLog(`${target.name} из армии ${target.side} убит!`);
        } else {
            super.attack(target); 
        }
    }

    dead() {
        this.warriorArmyElement.querySelector('.warrior-ico').src = elfSkullIcon;
    }
}
