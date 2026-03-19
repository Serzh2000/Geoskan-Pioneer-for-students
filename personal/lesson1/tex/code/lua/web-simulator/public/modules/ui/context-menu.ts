export function initContextMenu() {
    // Add CSS for Context Menu if not exists
    if (!document.getElementById('ctx-menu-style')) {
        const style = document.createElement('style');
        style.id = 'ctx-menu-style';
        style.textContent = `
            #object-context-menu {
                position: fixed;
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid #334155;
                border-radius: 8px;
                padding: 5px;
                display: none;
                flex-direction: column;
                gap: 5px;
                z-index: 1000;
                min-width: 150px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                backdrop-filter: blur(8px);
            }
            #object-context-menu.visible {
                display: flex;
            }
            .ctx-header {
                font-size: 11px;
                color: #94a3b8;
                padding: 5px 10px;
                border-bottom: 1px solid #334155;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .ctx-btn {
                background: transparent;
                border: none;
                color: #f1f5f9;
                text-align: left;
                padding: 8px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s;
            }
            .ctx-btn:hover {
                background: rgba(56, 189, 248, 0.1);
                color: #38bdf8;
            }
            .ctx-btn.danger { color: #f87171; }
            .ctx-btn.danger:hover { background: rgba(248, 113, 113, 0.1); }
            .ctx-btn.cancel { color: #94a3b8; border-top: 1px solid #334155; margin-top: 5px; }
        `;
        document.head.appendChild(style);
    }

    // Context Menu for 3D Objects
    const ctxMenu = document.createElement('div');
    ctxMenu.id = 'object-context-menu';
    
    // Prevent clicks on the menu from reaching the canvas
    ctxMenu.addEventListener('mousedown', (e) => e.stopPropagation());
    ctxMenu.addEventListener('pointerdown', (e) => e.stopPropagation());
    ctxMenu.addEventListener('pointerup', (e) => e.stopPropagation());
    ctxMenu.addEventListener('click', (e) => e.stopPropagation());
    
    const header = document.createElement('div');
    header.className = 'ctx-header';
    header.textContent = 'Действия над объектом';
    
    ctxMenu.appendChild(header);
    document.body.appendChild(ctxMenu);

    window.showContextMenu = function(x: number, y: number, onTransform: (mode: string) => void, onDelete: () => void, onDuplicate: () => void) {
        const menuWidth = 160; 
        const menuHeight = 220; 
        
        let posX = x;
        let posY = y;
        
        if (posX + menuWidth > window.innerWidth) posX = window.innerWidth - menuWidth;
        if (posY + menuHeight > window.innerHeight) posY = window.innerHeight - menuHeight;
        
        ctxMenu.style.left = posX + 'px';
        ctxMenu.style.top = posY + 'px';
        ctxMenu.style.transform = 'none'; 
        ctxMenu.classList.add('visible');
        
        // Clear previous buttons
        ctxMenu.innerHTML = '';
        ctxMenu.appendChild(header);

        const actions = [
            { label: '📍 Переместить', mode: 'translate', icon: '📍' },
            { label: '🔄 Повернуть', mode: 'rotate', icon: '🔄' },
            { label: '📏 Масштаб', mode: 'scale', icon: '📏' },
            { label: '📋 Дублировать', action: onDuplicate, icon: '📋' },
            { label: '🗑️ Удалить', action: onDelete, icon: '🗑️', danger: true }
        ];

        actions.forEach(act => {
            const btn = document.createElement('button');
            btn.className = 'ctx-btn' + (act.danger ? ' danger' : '');
            btn.innerHTML = `<span>${act.icon}</span> ${act.label.split(' ')[1]}`;
            // Prevent mousedown from propagating to canvas (which closes menu)
            btn.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.hideContextMenu();
                if (act.mode) onTransform(act.mode);
                else if (act.action) act.action();
            });
            ctxMenu.appendChild(btn);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'ctx-btn cancel';
        cancelBtn.innerHTML = '<span>✖</span> Отмена';
        cancelBtn.onclick = () => window.hideContextMenu();
        ctxMenu.appendChild(cancelBtn);
        
        setTimeout(() => (ctxMenu.querySelector('.ctx-btn') as HTMLElement)?.focus(), 50);
    };

    window.hideContextMenu = function() {
        ctxMenu.classList.remove('visible');
    };

    // Close menu on outside click or Escape
    document.addEventListener('mousedown', (e: MouseEvent) => {
        // Only hide if we're not clicking inside the canvas (which is handled separately)
        const target = e.target as HTMLElement;
        if (target.tagName !== 'CANVAS' && ctxMenu.classList.contains('visible') && !ctxMenu.contains(target)) {
            window.hideContextMenu();
        }
    });
    
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && ctxMenu.classList.contains('visible')) {
            window.hideContextMenu();
        }
    });
}