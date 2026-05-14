import * as Blockly from 'blockly';
import { luaGenerator } from 'blockly/lua';
import { pythonGenerator } from 'blockly/python';
import type { ScriptLanguage } from '../api-docs/sections.js';

let definitionsInitialized = false;

type BlocklyCodeGenerator = typeof luaGenerator | typeof pythonGenerator;

export { Blockly };

export function getBlocklyGenerator(language: ScriptLanguage): BlocklyCodeGenerator {
    return language === 'lua' ? luaGenerator : pythonGenerator;
}

export function initBlocklyDefinitions() {
    if (definitionsInitialized) return;
    definitionsInitialized = true;

    // --- LUA BLOCKS ---

    Blockly.Blocks['lua_ledbar_new'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("создать Ledbar(")
                .appendField(new Blockly.FieldNumber(4, 1, 100), "COUNT")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Инициализирует светодиодную ленту");
        }
    };
    luaGenerator.forBlock['lua_ledbar_new'] = function(block: any) {
        const count = block.getFieldValue('COUNT');
        return `local leds = Ledbar.new(${count})\n`;
    };

    Blockly.Blocks['lua_led_set'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("leds:set(")
                .appendField(new Blockly.FieldNumber(0, 0, 100), "INDEX")
                .appendField(",")
                .appendField(new Blockly.FieldNumber(0, 0, 1), "R")
                .appendField(",")
                .appendField(new Blockly.FieldNumber(0, 0, 1), "G")
                .appendField(",")
                .appendField(new Blockly.FieldNumber(0, 0, 1), "B")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Установить цвет светодиода");
        }
    };
    luaGenerator.forBlock['lua_led_set'] = function(block: any) {
        const idx = block.getFieldValue('INDEX');
        const r = block.getFieldValue('R');
        const g = block.getFieldValue('G');
        const b = block.getFieldValue('B');
        return `leds:set(${idx}, ${r}, ${g}, ${b})\n`;
    };

    Blockly.Blocks['lua_timer_calllater'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Timer.callLater(")
                .appendField(new Blockly.FieldNumber(0.5, 0), "DELAY")
                .appendField(")");
            this.appendStatementInput("CALLBACK")
                .setCheck(null);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Откладывает вложенные блоки: все, что находится внутри, попадет в function() ... end и выполнится позже.");
        }
    };
    luaGenerator.forBlock['lua_timer_calllater'] = function(block: any) {
        const delay = block.getFieldValue('DELAY');
        const callback = luaGenerator.statementToCode(block, 'CALLBACK') || '';
        return `Timer.callLater(${delay}, function()\n${callback}end)\n`;
    };

    Blockly.Blocks['lua_print'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("print(")
                .appendField(new Blockly.FieldTextInput("сообщение"), "TEXT")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
        }
    };
    luaGenerator.forBlock['lua_print'] = function(block: any) {
        const text = block.getFieldValue('TEXT');
        return `print("${text}")\n`;
    };

    Blockly.Blocks['lua_ap_push'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("ap.push(")
                .appendField(new Blockly.FieldDropdown([
                    ["Ev.MCE_PREFLIGHT", "Ev.MCE_PREFLIGHT"],
                    ["Ev.MCE_TAKEOFF", "Ev.MCE_TAKEOFF"],
                    ["Ev.MCE_LANDING", "Ev.MCE_LANDING"]
                ]), "EVENT")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
        }
    };
    luaGenerator.forBlock['lua_ap_push'] = function(block: any) {
        const ev = block.getFieldValue('EVENT');
        return `ap.push(${ev})\n`;
    };

    Blockly.Blocks['lua_event_callback'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("if event ==")
                .appendField(new Blockly.FieldDropdown([
                    ["Ev.ENGINES_STARTED", "Ev.ENGINES_STARTED"],
                    ["Ev.TAKEOFF_COMPLETE", "Ev.TAKEOFF_COMPLETE"],
                    ["Ev.POINT_REACHED", "Ev.POINT_REACHED"]
                ]), "EVENT")
                .appendField("then");
            this.appendStatementInput("DO")
                .setCheck(null);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(210);
        }
    };
    luaGenerator.forBlock['lua_event_callback'] = function(block: any) {
        const ev = block.getFieldValue('EVENT');
        const statements = luaGenerator.statementToCode(block, 'DO') || '';
        return `if event == ${ev} then\n${statements}end\n`;
    };

    Blockly.Blocks['lua_goto_local_point'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("ap.goToLocalPoint(")
                .appendField(new Blockly.FieldNumber(1), "X")
                .appendField(",")
                .appendField(new Blockly.FieldNumber(0), "Y")
                .appendField(",")
                .appendField(new Blockly.FieldNumber(1), "Z")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
        }
    };
    luaGenerator.forBlock['lua_goto_local_point'] = function(block: any) {
        const x = block.getFieldValue('X');
        const y = block.getFieldValue('Y');
        const z = block.getFieldValue('Z');
        return `ap.goToLocalPoint(${x}, ${y}, ${z})\n`;
    };


    // --- PYTHON BLOCKS ---

    Blockly.Blocks['py_led_control'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("pioneer.led_control(r=")
                .appendField(new Blockly.FieldNumber(255, 0, 255), "R")
                .appendField(", g=")
                .appendField(new Blockly.FieldNumber(0, 0, 255), "G")
                .appendField(", b=")
                .appendField(new Blockly.FieldNumber(0, 0, 255), "B")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
        }
    };
    pythonGenerator.forBlock['py_led_control'] = function(block: any) {
        const r = block.getFieldValue('R');
        const g = block.getFieldValue('G');
        const b = block.getFieldValue('B');
        return `pioneer.led_control(r=${r}, g=${g}, b=${b})\n`;
    };

    Blockly.Blocks['py_time_sleep'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("time.sleep(")
                .appendField(new Blockly.FieldNumber(1, 0), "TIME")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
        }
    };
    pythonGenerator.forBlock['py_time_sleep'] = function(block: any) {
        const t = block.getFieldValue('TIME');
        return `time.sleep(${t})\n`;
    };

    Blockly.Blocks['py_print'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("print(")
                .appendField(new Blockly.FieldTextInput("сообщение"), "TEXT")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
        }
    };
    pythonGenerator.forBlock['py_print'] = function(block: any) {
        const text = block.getFieldValue('TEXT');
        return `print("${text}")\n`;
    };

    Blockly.Blocks['py_arm'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("pioneer.arm()");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
        }
    };
    pythonGenerator.forBlock['py_arm'] = function(block: any) {
        return `pioneer.arm()\n`;
    };

    Blockly.Blocks['py_takeoff'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("pioneer.takeoff()");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
        }
    };
    pythonGenerator.forBlock['py_takeoff'] = function(block: any) {
        return `pioneer.takeoff()\n`;
    };

    Blockly.Blocks['py_land'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("pioneer.land()");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
        }
    };
    pythonGenerator.forBlock['py_land'] = function(block: any) {
        return `pioneer.land()\n`;
    };

    Blockly.Blocks['py_goto_local_point'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("pioneer.go_to_local_point(x=")
                .appendField(new Blockly.FieldNumber(1), "X")
                .appendField(", y=")
                .appendField(new Blockly.FieldNumber(0), "Y")
                .appendField(", z=")
                .appendField(new Blockly.FieldNumber(1), "Z")
                .appendField(")");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
        }
    };
    pythonGenerator.forBlock['py_goto_local_point'] = function(block: any) {
        const x = block.getFieldValue('X');
        const y = block.getFieldValue('Y');
        const z = block.getFieldValue('Z');
        return `pioneer.go_to_local_point(x=${x}, y=${y}, z=${z})\n`;
    };

    Blockly.Blocks['py_wait_point_reached'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("while not pioneer.point_reached(): time.sleep(0.05)");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
        }
    };
    pythonGenerator.forBlock['py_wait_point_reached'] = function(block: any) {
        return `while not pioneer.point_reached():\n    time.sleep(0.05)\n`;
    };
}
