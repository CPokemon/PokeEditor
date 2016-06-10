let Memory = require('./memory');

class PKX {
    constructor(binary) {
        this._bin = binary;
    }

    _setIVs(IVs, isEgg, isNicknamed) {
        let current_data = this._getIVs();
        let IV32 = new Uint32Array(1);
        let IV_HP = IVs.hp || current_data.hp;
        let IV_Attack = IVs.attack || current_data.attack;
        let IV_Defense = IVs.defense || current_data.defense;
        let IV_Speed = IVs.speed || current_data.speed;
        let IV_SpecialAttack = IVs.specialattack || current_data.specialattack;
        let IV_SpecialDefense = IVs.specialdefense || current_data.specialdefense;
        let Is_Egg = Number(isEgg) || current_data.is_egg;
        let Is_Nicknamed = Number(isNicknamed) || current_data.is_nicknamed;
        IV32[0] = IVs.hp || current_data.hp & 0x1F;
        IV32[0] |= ((IVs.hp || current_data.hp & 0x1F) << 5);
        IV32[0] |= ((IVs.defense || current_data.defense & 0x1F) << 10);
        IV32[0] |= ((IVs.speed || current_data.speed & 0x1F) << 15);
        IV32[0] |= ((IVs.specialattack || current_data.specialattack & 0x1F) << 20);
        IV32[0] |= ((IVs.specialdefense || current_data.specialdefense & 0x1F) << 25);
        IV32[0] |= ((isEgg? 1 : 0) || current_data.is_egg << 30);
        IV32[0] |= ((isNicknamed? 1 : 0) || current_data.is_nicknamed << 31);
        let u8a = new Uint8Array(IV32.buffer);
        Memory.RW.setValueAt(Memory.pkx.INDIVIDUAL_VALUES, u8a, this._bin);
        return true;
    }

    _getIVs() {
        let memory = Memory.RW.getValueAt(Memory.pkx.map.INDIVIDUAL_VALUES, this._bin);
        let u32a = new Uint32Array(memory.buffer);
        let ivs = {};
        ivs.hp = (u32a[0] & 0x1F);
        ivs.attack = (u32a[0] >> 5) & 0x1F;
        ivs.defense = (u32a[0] >> 10) & 0x1F;
        ivs.speed = (u32a[0] >> 15) & 0x1F;
        ivs.specialattack = (u32a[0] >> 20) & 0x1F;
        ivs.specialdefense = (u32a[0] >> 25) & 0x1F;
        ivs.is_egg = ((u32a[0] >> 30) & 1);
        ivs.is_nicknamed = ((u32a[0] >> 31));
        return ivs;
    }

    get nationalID() {
        let memory = Memory.RW.getValueAt(Memory.pkx.map.NATIONAL_POKEDEX_ID, this._bin);
        let u16a = new Uint16Array(memory.buffer);
        return u16a[0];
    }
    set nationalID(pokedexId) {
        let buffer = new Uint16Array([pokedexId]);
        let memory = new Uint8Array(buffer.buffer);
        Memory.RW.setValueAt(Memory.pkx.map.NATIONAL_POKEDEX_ID, memory, this._bin);
    }

    get heldItem() {
        let memory = Memory.RW.getValueAt(Memory.pkx.map.HELD_ITEM, this._bin);
        let u16a = new Uint16Array(memory.buffer);
        return u16a[0];
    }
    set heldItem(item) {
        let buffer = new Uint16Array([item]);
        let memory = new Uint8Array(buffer.buffer);
        Memory.RW.setValueAt(Memory.pkx.map.HELD_ITEM, memory, this._bin);
    }

    get originalTrainerID() {
        let memory = Memory.RW.getValueAt(Memory.pkx.map.OT_ID, this._bin);
        let u16a = new Uint16Array(memory.buffer);
        return u16a[0];
    }
    set originalTrainerID(otID) {
        let buffer = new Uint16Array([otID]);
        let memory = new Uint8Array(buffer.buffer);
        Memory.RW.setValueAt(Memory.pkx.map.OT_ID, memory, this._bin);
    }

    get experience() {
        let memory = Memory.RW.getValueAt(Memory.pkx.map.EXP_POINTS, this._bin);
        let u32a = new Uint32Array(memory.buffer);
        return u32a[0];
    }
    set experience(exp) {
        let buffer = new Uint32Array([exp]);
        let memory = new Uint8Array(buffer.buffer);
        Memory.RW.setValueAt(Memory.pkx.map.EXP_POINTS, memory, this._bin);
    }
    
    get nickName() {
        let memory = Memory.RW.getValueAt(Memory.pkx.map.NICKNAME, this._bin);
        return String.fromCharCode.apply(null, memory);
    }
    set nickName(nickname) {
        let offset = Memory.pkx.map.NICKNAME;
        let u16a = new Uint16Array(0x9);
        for (var i = 0; i < nickname.length; ++i) {
            u16a[i] = nickname.charCodeAt(i);
        }
        let u8a = new Uint8Array(u16a.buffer);
        Memory.RW.setValueAt(Memory.pkx.map.NICKNAME, u8a, this._bin);
    }
    get EVs() {
        let memoryHP = Memory.RW.getValueAt(Memory.pkx.map.EV_HP, this._bin);
        let memoryATTACK = Memory.RW.getValueAt(Memory.pkx.map.EV_ATTACK, this._bin);
        let memoryDEFENSE = Memory.RW.getValueAt(Memory.pkx.map.EV_DEFENSE, this._bin);
        let memorySPECIALATTACK = Memory.RW.getValueAt(Memory.pkx.map.EV_SPECIALATTACK, this._bin);
        let memorySPECIALDEFENSE = Memory.RW.getValueAt(Memory.pkx.map.EV_SPECIALDEFENSE, this._bin);
        let memorySPEED = Memory.RW.getValueAt(Memory.pkx.map.EV_SPEED, this._bin);
        let evs = {};
        evs.hp = memoryHP[0];
        evs.attack = memoryATTACK[0];
        evs.defense = memoryDEFENSE[0];
        evs.specialattack = memorySPECIALATTACK[0];
        evs.specialdefense = memorySPECIALDEFENSE[0];
        evs.speed = memorySPEED[0];
        return evs;
    }
    set EVs(evs) {
        let current = this.EVs;
        let tmpEVs = {};
        tmpEVs.hp = new Uint8Array([evs.hp || current.hp]);
        tmpEVs.attack = new Uint8Array([evs.attack || current.attack]);
        tmpEVs.defense = new Uint8Array([evs.defense || current.defense]);
        tmpEVs.specialattack = new Uint8Array([evs.specialattack || current.specialattack]);
        tmpEVs.specialdefense = new Uint8Array([evs.specialdefense || current.specialdefense]);
        tmpEVs.speed = new Uint8Array([evs.speed || current.speed]);
        Memory.RW.setValueAt(Memory.pkx.map.EV_HP, tmpEVs.hp, this._bin);
        Memory.RW.setValueAt(Memory.pkx.map.EV_ATTACK, tmpEVs.attack, this._bin);
        Memory.RW.setValueAt(Memory.pkx.map.EV_DEFENSE, tmpEVs.defense, this._bin);
        Memory.RW.setValueAt(Memory.pkx.map.EV_SPECIALATTACK, tmpEVs.specialattack, this._bin);
        Memory.RW.setValueAt(Memory.pkx.map.EV_SPECIALDEFENSE, tmpEVs.specialdefense, this._bin);
        Memory.RW.setValueAt(Memory.pkx.map.EV_SPEED, tmpEVs.speed, this._bin);
    }
}

module.exports = PKX;