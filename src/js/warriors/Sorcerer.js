import Warrior from "./warrior";
import sorcererIcon from '../../assets/icons/warriors/sorcerer.svg'
import sorcererSkullIcon from '../../assets/icons/warriors/sorcerer_skull.svg'

import BattleLog from '../BattleLog'

export default class Sorcerer extends Warrior {
    constructor(name, strength, speed, accuracy, armor, army) {
        super(name, 'sorcerer', strength, speed, accuracy, 0, sorcererIcon, army);
    }

    charm(target) {
        if (this.didHit(target)) {
            BattleLog.addBattleLog(`${this.name} зачаровал ${this.correctNamesInText(target.name, 'genitive')}!`);
            
            const classesMapping = {
                1: ['army1-charm', 'army2-charm'],
                2: ['army2-charm', 'army1-charm']
            };
            
            target.warriorArmyElement.classList.remove(classesMapping[target.side][0]);
            target.warriorArmyElement.classList.add(classesMapping[target.side][1]);
            
            target.getAtacked('charm');
            target.switchSide();
        } else {
            BattleLog.addBattleLog(`${this.name} из армии ${this.side} не смог зачаровать ${this.correctNamesInText(target.name, 'genitive')} из армии ${target.side}.`);
        }
    }

    didHit(target) {
        return (this.accuracy / 20) + Math.random() >= (target.speed / 20) + Math.random();
    }

    attack(target) {
        this.charm(target);
        this.updateWarriorCard();
        target.updateWarriorCard();
    }

    dead() {
        this.warriorArmyElement.querySelector('.warrior-ico').src = sorcererSkullIcon;
        this.warriorArmyElement.querySelector('#armorBar').style.width = `0%`;
    }
}
