import Warrior from "./warrior";
import footmanIcon from '../../assets/icons/warriors/footman.svg'
import cavalryIcon from '../../assets/icons/warriors/cavalry.svg'
import humanSkullIcon from '../../assets/icons/warriors/human_skull.svg'

export default class Human extends Warrior {
    constructor(name, strength, speed, accuracy, armor, type, army) {
        const humanIcon = (type === "Footman") ? footmanIcon : cavalryIcon;

        super(name, 'human', strength, speed, accuracy, armor, humanIcon, army);
        this.type = type;
    }

    attack(target) {
        const attackType = (this.type === "Footman") ? 'sword' : 'spear';
        target.getAtacked(attackType);
        super.attack(target); 
    }

    dead() {
        this.warriorArmyElement.querySelector('.warrior-ico').src = humanSkullIcon;
    }
}