class BattleLog {
    constructor() {
        this.battleTurnsElement = document.getElementById('battleTurns');
        this.battleLog = [];
    }

    clearLogs() {
        this.battleLog = [];
    }

    saveLogsToLS() {
        try {
            const allLogs = JSON.parse(sessionStorage.getItem('battle-logs')) || [];
            
            if (this.battleLog.length > 0) {
                allLogs.push([...this.battleLog]);
                sessionStorage.setItem('battle-logs', JSON.stringify(allLogs));
                this.clearLogs();
            }
        } catch (error) {
            console.log(`Error saving logs: ${error}`);
        }
    }

    loadLogsFromLS() {
        const logs = JSON.parse(sessionStorage.getItem('battle-logs')) || [];

        logs.forEach(log => {
            log.forEach(({text, type}) => this.addBattleLog(text, type));
        });
    }

    clearLogsFromLS() {
        sessionStorage.removeItem('battle-logs');
    }

    addBattleLog(text, type = 'warriorLog') {
        this.battleLog.push({ text, type });

        const battleTurn = document.createElement('div');
        battleTurn.className = 'battle-log_message';

        const colorMap = {
            startBattle: '#293474',
            endBattle: '#bd3131'
        };
        
        if (colorMap[type]) {
            battleTurn.style.background = colorMap[type];
        }

        battleTurn.innerHTML = `<span class="battle-log_text">${text}</span>`;
        this.battleTurnsElement.appendChild(battleTurn);
        this.scrollToTop();
    }

    scrollToTop() {
        this.battleTurnsElement.scrollTop = -this.battleTurnsElement.scrollHeight;
    }
}

export default new BattleLog();
