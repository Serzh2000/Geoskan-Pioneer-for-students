export function setupSyntaxHighlighting(monaco: any) {
    monaco.languages.setMonarchTokensProvider('lua', {
        tokenizer: {
            root: [
                // Pioneer Modules
                [/\b(ap|Sensors|Timer|Ledbar|camera|Gpio|Uart|Spi|mailbox)\b/, "keyword.class"],
                
                // Pioneer Methods (generic matcher for simplicity, specific ones handled by autocomplete)
                [/\b(push|goToLocalPoint|goToPoint|updateYaw|lpsPosition|lpsVelocity|lpsYaw|accel|gyro|orientation|range|battery|tof|altitude|rc|callLater|callAt|callAtGlobal|new|set|start|stop|read|write|reset|setFunction|bytesToRead|setBaudRate|exchange|connect|hasMessages|myHullNumber|receive|send|setHullNumber|requestMakeShot|checkRequestShot|requestRecordStart|requestRecordStop|checkRequestRecord|fromHSV|time|deltaTime|launchTime|sleep|boardNumber)\b/, "function.call"],
                
                // Constants
                [/\b(Ev)\.[A-Z_]+\b/, "constant"],
                [/\b(Ev)\b/, "constant"],
                
                // Lua Keywords
                [/\b(and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/, "keyword"],
                
                // Comments
                [/--\[\[[\s\S]*?(?:\]\]|$)/, 'comment'],
                [/--.*$/, "comment"],
                
                // Strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
                [/"([^"\\]|\\.)*"/, 'string'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/'([^'\\]|\\.)*'/, 'string'],
                
                // Numbers
                [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
                [/\d+/, "number"]
            ]
        }
    });

    monaco.editor.defineTheme('pioneer-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword.class', foreground: '4ec9b0', fontStyle: 'bold' }, // Pioneer Modules (Greenish Cyan)
            { token: 'function.call', foreground: 'dcdcaa' }, // Methods (Yellowish)
            { token: 'constant', foreground: '569cd6', fontStyle: 'bold' }, // Constants (Blue)
            { token: 'comment', foreground: '6a9955' }, // Comments (Green)
            { token: 'string', foreground: 'ce9178' }, // Strings (Orange)
            { token: 'number', foreground: 'b5cea8' }, // Numbers (Light Green)
            { token: 'keyword', foreground: 'c586c0' } // Keywords (Purple)
        ],
        colors: {
            'editor.background': '#1e1e1e',
            'editor.foreground': '#d4d4d4'
        }
    });
}
