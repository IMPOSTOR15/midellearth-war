import strengthIcon from '../../assets/icons/attributes/strength.svg'
import accuracyIcon from '../../assets/icons/attributes/accuracy.svg'
import armorIcon from '../../assets/icons/attributes/armor.svg'
import speedIcon from '../../assets/icons/attributes/speed.svg'

import charmIcon from '../../assets/icons/effects/magic.svg'
import swordIcon from '../../assets/icons/effects/sword.svg'
import spearIcon from '../../assets/icons/effects/spear.svg'
import arrowIcon from '../../assets/icons/effects/arrow.svg'
import axeIcon from '../../assets/icons/effects/axe.svg'

import BattleLog from '../BattleLog.js'
import { nameMapping } from '../consts.js'

export default class Warrior {
    constructor(name, race, strength, speed, accuracy, armor, avatar, side) {
        this.side = side;
        this.name = name;
        this.race = race
        this.strength = strength;
        this.speed = speed;
        this.accuracy = accuracy;
        this.armor = armor;
        this.maxArmor = this.armor;
        this.alive = true;
        this.avatar = avatar;

        this.warriorArmyElement = null;
    }

    attack(target) {
        let damage = (this.strength / 2) + (Math.random() * this.strength * 0.2 - this.strength * 0.1);
        let hitChance = this.accuracy / 20;
        if ((Math.random() - 0.3) > hitChance) {
            BattleLog.addBattleLog(`${this.name} из армии ${this.side} промахнулся по ${this.correctNamesInText(target.name, 'dative')} из армии ${target.side}.`);
            return;
        }

        let dodgeChance = target.speed / 20;
        if ((Math.random() + 0.3) < dodgeChance) {
            BattleLog.addBattleLog(`${target.name} из армии ${target.side} уклонился от удара ${this.correctNamesInText(this.name, 'genitive')} из армии ${this.side}.`);
            return;
        }

        damage = Math.round(damage, 10)
        if (damage > 0) {
            BattleLog.addBattleLog(`${this.name} из армии ${this.side} ударил ${this.correctNamesInText(target.name, 'genitive')} из армии ${target.side} на ${damage} урона.`);
            target.armor -= damage;
            if (target.armor <= 0) {
                target.alive = false;
                target.armor = 0;
                target.dead();
                BattleLog.addBattleLog(`${target.name} из армии ${target.side} убит!`);
            }
        } else {
            BattleLog.addBattleLog(`${this.name} из армии ${this.side} не смог пробить броню ${this.correctNamesInText(target.name, 'genitive')} из армии ${target.side}.`);
        }
        
        this.updateWarriorCard();
        target.updateWarriorCard();
    }

    correctNamesInText(text, caseType) {
        const names = Object.keys(nameMapping).sort((a, b) => b.length - a.length);
        const nameRegex = new RegExp(names.join('|') + "(?: [0-9]+)?", 'g');

        const correctedText = text.replace(nameRegex, (match) => {
            const baseNameMatch = match.match(/([А-ЯЁа-яё]+(?: [А-ЯЁа-яё]+)?)/);
            const numberMatch = match.match(/([0-9]+)/);

            const baseName = baseNameMatch ? baseNameMatch[0] : '';
            const number = numberMatch ? numberMatch[0] : '';

            if (nameMapping[baseName]) {
                return nameMapping[baseName][caseType] + (number ? ' ' + number : '');
            }
            return match;
        });
        return correctedText;
    }
      
    attackEffects = {
        'charm': { className: 'atack-effect_charm', icon: charmIcon, duration: 900 },
        'sword': { className: 'atack-effect_sword', icon: swordIcon, duration: 450 },
        'spear': { className: 'atack-effect_spear', icon: spearIcon, duration: 450 },
        'arrow': { className: 'atack-effect_arrow', icon: arrowIcon, duration: 400 },
        'axe': { className: 'atack-effect_axe', icon: axeIcon, duration: 450 }
    };

    getAtacked(type) {
        if (this.attackEffects[type]) {
            const { className, icon, duration } = this.attackEffects[type];
            const effectElement = document.createElement('img');
            effectElement.classList.add(className);
            effectElement.src = icon;
            this.warriorArmyElement.appendChild(effectElement);

            setTimeout(() => {
                this.warriorArmyElement.removeChild(effectElement);
            }, duration);
        }
    }

    switchSide() {
        this.side = this.side === 1 ? 2 : 1;
        BattleLog.addBattleLog(`${this.name} поменял сторону!`);
    }

    setAttributes(strength, speed, accuracy, armor, avatar, side) {
        this.strength = strength;
        this.speed = speed;
        this.accuracy = accuracy;
        this.armor = armor;
        this.alive = true;
        this.avatar = avatar
        this.side = side
    }

    createAttributeElement(icon, value, id) {
        const element = document.createElement('div');
        element.classList.add('wirrior-card_attribute');

        const iconElement = document.createElement('img');
        iconElement.src = icon;
        iconElement.classList.add('wirrior-card_icon');
        element.appendChild(iconElement);

        const textElement = document.createElement('span');
        textElement.textContent = value;
        textElement.id = id;
        element.appendChild(textElement);

        return element;
    }

    render() {
        const warriorDiv = document.createElement('div');
        warriorDiv.classList.add('warrior')

        const warriorTitle = document.createElement('span')
        warriorTitle.classList.add('warrior_title');
        warriorTitle.textContent = this.name;

        const warriorImg = document.createElement('img');
        warriorImg.src = this.avatar;
        warriorImg.classList.add('warrior-ico');

        const warriorAttributes = document.createElement('div');
        warriorAttributes.classList.add('warrior-attributes');

        const attributes = [
            { icon: strengthIcon, value: this.strength, id: 'strength' },
            { icon: speedIcon, value: this.speed, id: 'speed' },
            { icon: accuracyIcon, value: this.accuracy, id: 'accuracy' },
            { icon: armorIcon, value: this.armor, id: 'armor' }
        ];

        for (const attribute of attributes) {
            const attributeElement = this.createAttributeElement(attribute.icon, attribute.value, attribute.id);
            warriorAttributes.appendChild(attributeElement);
        }

        const armorBarWrapper = document.createElement('div');
        armorBarWrapper.classList.add('armor-bar__wrapper');

        const armorBar = document.createElement('div');
        armorBar.classList.add('armor-bar');
        armorBar.id = 'armorBar';
        armorBar.style.width = `${(this.armor / this.maxArmor) * 100}%`;
        armorBarWrapper.appendChild(armorBar);

        warriorDiv.appendChild(warriorTitle);
        warriorDiv.appendChild(warriorImg);
        warriorDiv.appendChild(warriorAttributes);
        warriorDiv.appendChild(armorBarWrapper);

        this.warriorArmyElement = warriorDiv;
        return warriorDiv;
    }

    updateWarriorCard() {
        this.warriorArmyElement.querySelector('#strength').textContent = this.strength;
        this.warriorArmyElement.querySelector('#speed').textContent = this.speed;
        this.warriorArmyElement.querySelector('#accuracy').textContent = this.accuracy;
        this.warriorArmyElement.querySelector('#armor').textContent = this.armor;
        this.warriorArmyElement.querySelector('#armorBar').style.width = `${(this.armor / this.maxArmor) * 100}%`
    }
}