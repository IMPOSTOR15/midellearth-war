import Warrior from "./warrior";
import orcLightIcon from '../../assets/icons/warriors/orc_light.svg'
import orcHeavyIcon from '../../assets/icons/warriors/orc_heavy.svg'
import orcSkullIcon from '../../assets/icons/warriors/orc_skull.svg'

export default class Orc extends Warrior {
    constructor(name, strength, speed, accuracy, armor, type, army) {
        const orcIcon = (type === "Light") ? orcLightIcon : orcHeavyIcon;
        
        super(name, 'orc', strength, speed, accuracy, armor, orcIcon, army);
        
        this.type = type;
    }

    attack(target) {
        target.getAtacked('axe');
        super.attack(target); 
    }

    dead() {
        this.warriorArmyElement.querySelector('.warrior-ico').src = orcSkullIcon;
    }
}