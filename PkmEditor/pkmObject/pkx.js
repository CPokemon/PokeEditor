let Memory = require('./../memory');

class PKX {
    constructor(binary) {
        this._bin = binary;
    }

    _setIVs(IVs, isEgg, isNicknamed) {
        let offset = Memory.pkx.INDIVIDUAL_VALUES;
        let current_data = this.GetIndividualValues();
        let IV32 = new Uint32Array(1);
        let IV_HP = IVs.hp || current_data.hp;
        let IV_Attack = IVs.attack || current_data.attack;
        let IV_Defense = IVs.defense || current_data.defense;
        let IV_Speed = IVs.speed || current_data.speed;
        let IV_SpecialAttack = IVs.specialattack || current_data.specialattack;
        let IV_SpecialDefense = IVs.specialdefense || current_data.specialdefense;
        let Is_Egg = Number(isEgg) || current_data.is_egg;
        let Is_Nicknamed = Number(isNicknamed) || current_data.is_nicknamed;
        IV32[0] = IV_HP & 0x1F;
        IV32[0] |= ((IV_Attack & 0x1F) << 5);
        IV32[0] |= ((IV_Defense & 0x1F) << 10);
        IV32[0] |= ((IV_Speed & 0x1F) << 15);
        IV32[0] |= ((IV_SpecialAttack & 0x1F) << 20);
        IV32[0] |= ((IV_SpecialDefense & 0x1F) << 25);
        IV32[0] |= (Is_Egg << 30);
        IV32[0] |= (Is_Nicknamed << 31);
        let u8a = new Uint8Array(IV32.buffer);
        Memory.RW.setValueAt(offset.address, u8a, offset.bits, this._bin);
        return true;
    }

    _getIVs() {
        let offset = Memory.pkx.map.INDIVIDUAL_VALUES;
        let memory = Memory.RW.getValueAt(offset.address, offset.bits, this._bin);
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
        let offset = Memory.pkx.map.NATIONAL_POKEDEX_ID;
        let memory = Memory.RW.getValueAt(offset.address, offset.bits, this._bin);
        let u16a = new Uint16Array(memory.buffer);
        return u16a[0];
    }
    set nationalID(pokedexId) {
        let offset = Memory.pkx.map.NATIONAL_POKEDEX_ID;
        let buffer = new Uint16Array([pokedexId]);
        let memory = new Uint8Array(buffer.buffer);
        Memory.RW.setValueAt(offset.address, memory, offset.bits, this._bin);
    }

    get heldItem() {
        let offset = Memory.pkx.map.HELD_ITEM;
        let memory = Memory.RW.getValueAt(offset.address, offset.bits, this._bin);
        let u16a = new Uint16Array(memory.buffer);
        return u16a[0];
    }
    set heldItem(item) {
        let offset = Memory.pkx.map.HELD_ITEM;
        let buffer = new Uint16Array([item]);
        let memory = new Uint8Array(buffer.buffer);
        Memory.RW.setValueAt(offset.address, memory, offset.bits, this._bin);
    }

    get originalTrainerID() {
        let offset = Memory.pkx.map.OT_ID;
        let memory = Memory.RW.getValueAt(offset.address, offset.bits, this._bin);
        let u16a = new Uint16Array(memory.buffer);
        return u16a[0];
    }
    set originalTrainerID(otID) {
        let offset = Memory.pkx.map.OT_ID;
        let buffer = new Uint16Array([otID]);
        let memory = new Uint8Array(buffer.buffer);
        Memory.RW.setValueAt(offset.address, memory, offset.bits, this._bin);
    }

    get experience() {
        let offset = Memory.pkx.map.EXP_POINTS;
        let memory = Memory.RW.getValueAt(offset.address, offset.bits, this._bin);
        let buffer = new Uint8Array([memory[0], memory[1], memory[2], 0x0]);
        let u32a = new Uint32Array(buffer.buffer);
        return u32a[0];
    }
    set experience(exp) {
        let offset = Memory.pkx.map.EXP_POINTS;
        let buffer = new Uint32Array([exp]);
        let u8a = new Uint8Array(buffer.buffer);
        let memory = new Uint8Array([u8a[0], u8a[1], u8a[2]]);
        Memory.RW.setValueAt(offset.address, memory, offset.bits, this._bin);
    }
    
    get nickName() {
        let offset = Memory.pkx.map.NICKNAME;
        let memory = Memory.RW.getValueAt(offset.address, offset.bits, this._bin);
        return String.fromCharCode.apply(null, memory);
    }
    set nickName(nickname) {
        let offset = Memory.pkx.map.NICKNAME;
        let u16a = new Uint16Array(0x9);
        for (var i = 0, j = nickname.length; i < j; ++i) {
            u16a[i] = nickname.charCodeAt(i);
        }
        let u8a = new Uint8Array(u16a.buffer);
        Memory.RW.setValueAt(offset.address, u8a, offset.bits, this._bin);
    }
}

module.exports = PKX;