// 考勤计算器核心逻辑
class AttendanceCalculator {
    constructor() {
        // 默认设置
        this.maxWorkDays = 22;
        this.requiredHoursPerDay = 9.5; // 9小时30分钟
        this.totalRequiredHours = this.maxWorkDays * this.requiredHoursPerDay;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.updateMonthlyStandard();
    }

    initializeElements() {
        this.workedDaysInput = document.getElementById('workedDays');
        this.avgHoursInput = document.getElementById('avgHours');
        this.avgMinutesInput = document.getElementById('avgMinutes');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resultSection = document.getElementById('resultSection');
        this.remainingDaysEl = document.getElementById('remainingDays');
        this.accumulatedHoursEl = document.getElementById('accumulatedHours');
        this.remainingHoursEl = document.getElementById('remainingHours');
        this.dailyRequiredHoursEl = document.getElementById('dailyRequiredHours');
        this.statusEl = document.getElementById('status');
        
        // 手动计算相关元素
        this.manualDaysInput = document.getElementById('manualDays');
        this.manualCalculateBtn = document.getElementById('manualCalculateBtn');
        this.manualResultSection = document.getElementById('manualResultSection');
        this.manualSpecifiedDaysEl = document.getElementById('manualSpecifiedDays');
        this.manualRemainingHoursEl = document.getElementById('manualRemainingHours');
        this.manualDailyHoursEl = document.getElementById('manualDailyHours');
        this.manualStatusEl = document.getElementById('manualStatus');
        
        // 设置相关元素
        this.customWorkDaysInput = document.getElementById('customWorkDays');
        this.customAvgHoursInput = document.getElementById('customAvgHours');
        this.customAvgMinutesInput = document.getElementById('customAvgMinutes');
        this.applySettingsBtn = document.getElementById('applySettingsBtn');
        this.monthlyStandardEl = document.getElementById('monthlyStandard');
    }

    bindEvents() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.manualCalculateBtn.addEventListener('click', () => this.manualCalculate());
        this.applySettingsBtn.addEventListener('click', () => this.applySettings());
        
        // 输入框回车事件
        this.workedDaysInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
        
        this.avgHoursInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
        
        this.avgMinutesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
        
        this.manualDaysInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.manualCalculate();
        });
        
        this.customWorkDaysInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applySettings();
        });
        
        this.customAvgHoursInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applySettings();
        });
        
        this.customAvgMinutesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applySettings();
        });

        // 实时输入验证
        this.workedDaysInput.addEventListener('input', () => this.validateInput());
        this.avgHoursInput.addEventListener('input', () => this.validateInput());
        this.avgMinutesInput.addEventListener('input', () => this.validateInput());
        this.manualDaysInput.addEventListener('input', () => this.validateManualInput());
        this.customWorkDaysInput.addEventListener('input', () => this.validateSettings());
        this.customAvgHoursInput.addEventListener('input', () => this.validateSettings());
        this.customAvgMinutesInput.addEventListener('input', () => this.validateSettings());
    }

    validateInput() {
        const workedDays = parseFloat(this.workedDaysInput.value);
        const avgHours = parseFloat(this.avgHoursInput.value);
        const avgMinutes = parseFloat(this.avgMinutesInput.value);

        // 清除之前的错误状态
        this.clearErrors();

        let hasError = false;

        // 验证已工作天数
        if (this.workedDaysInput.value && (workedDays < 1 || workedDays > this.maxWorkDays || !Number.isInteger(workedDays))) {
            this.showError(this.workedDaysInput, `已工作天数必须在1-${this.maxWorkDays}之间的整数`);
            hasError = true;
        }

        // 验证小时
        if (this.avgHoursInput.value && (avgHours < 0 || avgHours > 23 || !Number.isInteger(avgHours))) {
            this.showError(this.avgHoursInput, '小时必须在0-23之间的整数');
            hasError = true;
        }

        // 验证分钟
        if (this.avgMinutesInput.value && (avgMinutes < 0 || avgMinutes > 59 || !Number.isInteger(avgMinutes))) {
            this.showError(this.avgMinutesInput, '分钟必须在0-59之间的整数');
            hasError = true;
        }

        // 更新计算按钮状态
        this.calculateBtn.disabled = hasError || !this.workedDaysInput.value || (!this.avgHoursInput.value && !this.avgMinutesInput.value);
    }

    validateSettings() {
        const customWorkDays = parseFloat(this.customWorkDaysInput.value);
        const customAvgHours = parseFloat(this.customAvgHoursInput.value);
        const customAvgMinutes = parseFloat(this.customAvgMinutesInput.value);
        
        // 清除之前的错误状态
        this.clearSettingsErrors();

        let hasError = false;

        // 验证工作天数
        if (this.customWorkDaysInput.value && (customWorkDays < 1 || customWorkDays > 31 || !Number.isInteger(customWorkDays))) {
            this.showError(this.customWorkDaysInput, '工作天数必须在1-31之间的整数');
            hasError = true;
        }

        // 验证小时
        if (this.customAvgHoursInput.value && (customAvgHours < 0 || customAvgHours > 23 || !Number.isInteger(customAvgHours))) {
            this.showError(this.customAvgHoursInput, '小时必须在0-23之间的整数');
            hasError = true;
        }

        // 验证分钟
        if (this.customAvgMinutesInput.value && (customAvgMinutes < 0 || customAvgMinutes > 59 || !Number.isInteger(customAvgMinutes))) {
            this.showError(this.customAvgMinutesInput, '分钟必须在0-59之间的整数');
            hasError = true;
        }

        // 更新应用设置按钮状态
        this.applySettingsBtn.disabled = hasError || !this.customWorkDaysInput.value || (!this.customAvgHoursInput.value && !this.customAvgMinutesInput.value);
    }

    clearSettingsErrors() {
        this.customWorkDaysInput.classList.remove('error');
        this.customAvgHoursInput.classList.remove('error');
        this.customAvgMinutesInput.classList.remove('error');
        
        const errorMessages = document.querySelectorAll('.settings-section .error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    validateManualInput() {
        const manualDays = parseFloat(this.manualDaysInput.value);
        
        // 清除之前的错误状态
        this.clearManualErrors();

        let hasError = false;

        // 验证手动输入天数
        if (this.manualDaysInput.value && (manualDays < 1 || manualDays > this.maxWorkDays || !Number.isInteger(manualDays))) {
            this.showError(this.manualDaysInput, `指定天数必须在1-${this.maxWorkDays}之间的整数`);
            hasError = true;
        }

        // 更新手动计算按钮状态
        this.manualCalculateBtn.disabled = hasError || !this.manualDaysInput.value || !this.workedDaysInput.value || (!this.avgHoursInput.value && !this.avgMinutesInput.value);
    }

    clearManualErrors() {
        this.manualDaysInput.classList.remove('error');
        const errorMessages = this.manualDaysInput.parentNode.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    showError(input, message) {
        input.classList.add('error');
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        input.parentNode.appendChild(errorEl);
    }

    clearErrors() {
        // 移除错误样式
        this.workedDaysInput.classList.remove('error');
        this.avgHoursInput.classList.remove('error');
        this.avgMinutesInput.classList.remove('error');
        
        // 移除错误消息
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    calculate() {
        try {
            // 获取输入值
            const workedDays = parseInt(this.workedDaysInput.value);
            const avgHours = parseInt(this.avgHoursInput.value) || 0;
            const avgMinutes = parseInt(this.avgMinutesInput.value) || 0;

            // 输入验证
            if (!this.validateInputs(workedDays, avgHours, avgMinutes)) {
                return;
            }

            // 执行计算
            const result = this.performCalculation(workedDays, avgHours, avgMinutes);

            // 显示结果
            this.displayResult(result);

        } catch (error) {
            this.showStatus('计算过程中出现错误，请检查输入数据', 'error');
        }
    }

    validateInputs(workedDays, avgHours, avgMinutes) {
        this.clearErrors();
        let isValid = true;

        if (isNaN(workedDays) || workedDays < 1 || workedDays > this.maxWorkDays) {
            this.showError(this.workedDaysInput, `已工作天数必须在1-${this.maxWorkDays}之间的整数`);
            isValid = false;
        }

        if (isNaN(avgHours) || avgHours < 0 || avgHours > 23) {
            this.showError(this.avgHoursInput, '小时必须在0-23之间的整数');
            isValid = false;
        }

        if (isNaN(avgMinutes) || avgMinutes < 0 || avgMinutes > 59) {
            this.showError(this.avgMinutesInput, '分钟必须在0-59之间的整数');
            isValid = false;
        }

        return isValid;
    }

    performCalculation(workedDays, avgHours, avgMinutes) {
        const remainingDays = this.maxWorkDays - workedDays;
        
        // 将小时和分钟转换为总小时数
        const totalAvgHours = avgHours + (avgMinutes / 60);
        const accumulatedHours = workedDays * totalAvgHours;
        const remainingHours = this.totalRequiredHours - accumulatedHours;
        
        let dailyRequiredHours = 0;
        let status = '';

        if (remainingDays <= 0) {
            // 已工作满月
            status = '本月工作已完成';
            dailyRequiredHours = 0;
        } else if (remainingHours <= 0) {
            // 已达标
            status = '已满足月度工时要求';
            dailyRequiredHours = 0;
        } else {
            // 需要补足
            dailyRequiredHours = remainingHours / remainingDays;
            const requiredHours = Math.floor(dailyRequiredHours);
            const requiredMinutes = Math.round((dailyRequiredHours - requiredHours) * 60);
            status = `剩余${remainingDays}天，每日需打卡${requiredHours}小时${requiredMinutes}分钟`;
        }

        return {
            remainingDays: Math.max(0, remainingDays),
            accumulatedHours: this.formatTime(accumulatedHours),
            remainingHours: this.formatTime(Math.max(0, remainingHours)),
            dailyRequiredHours: this.formatTime(dailyRequiredHours),
            status: status
        };
    }

    displayResult(result) {
        // 更新结果数据
        this.remainingDaysEl.textContent = `${result.remainingDays} 天`;
        this.accumulatedHoursEl.textContent = result.accumulatedHours;
        this.remainingHoursEl.textContent = result.remainingHours;
        this.dailyRequiredHoursEl.textContent = result.dailyRequiredHours;

        // 显示结果区域
        this.resultSection.style.display = 'block';

        // 更新状态
        this.updateStatus(result);
    }

    updateStatus(result) {
        this.statusEl.textContent = result.status;
        this.statusEl.className = 'status';

        if (result.remainingHours <= 0) {
            this.statusEl.classList.add('success');
        } else if (result.dailyRequiredHours > 12) {
            this.statusEl.classList.add('warning');
        } else {
            this.statusEl.classList.add('info');
        }
    }

    showStatus(message, type = 'info') {
        this.statusEl.textContent = message;
        this.statusEl.className = `status ${type}`;
        this.resultSection.style.display = 'block';
    }

    // 格式化时间为小时和分钟
    formatTime(hours) {
        if (hours <= 0) return '0小时0分钟';
        
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        
        if (minutes === 60) {
            return `${wholeHours + 1}小时0分钟`;
        }
        
        return `${wholeHours}小时${minutes}分钟`;
    }

    // 手动计算功能
    manualCalculate() {
        try {
            // 获取输入值
            const workedDays = parseInt(this.workedDaysInput.value);
            const avgHours = parseInt(this.avgHoursInput.value) || 0;
            const avgMinutes = parseInt(this.avgMinutesInput.value) || 0;
            const manualDays = parseInt(this.manualDaysInput.value);

            // 输入验证
            if (!this.validateManualInputs(workedDays, avgHours, avgMinutes, manualDays)) {
                return;
            }

            // 执行手动计算
            const result = this.performManualCalculation(workedDays, avgHours, avgMinutes, manualDays);

            // 显示结果
            this.displayManualResult(result);

        } catch (error) {
            this.showManualStatus('计算过程中出现错误，请检查输入数据', 'error');
        }
    }

    validateManualInputs(workedDays, avgHours, avgMinutes, manualDays) {
        this.clearErrors();
        this.clearManualErrors();
        let isValid = true;

        // 验证基本输入
        if (isNaN(workedDays) || workedDays < 1 || workedDays > this.maxWorkDays) {
            this.showError(this.workedDaysInput, `已工作天数必须在1-${this.maxWorkDays}之间的整数`);
            isValid = false;
        }

        if (isNaN(avgHours) || avgHours < 0 || avgHours > 23) {
            this.showError(this.avgHoursInput, '小时必须在0-23之间的整数');
            isValid = false;
        }

        if (isNaN(avgMinutes) || avgMinutes < 0 || avgMinutes > 59) {
            this.showError(this.avgMinutesInput, '分钟必须在0-59之间的整数');
            isValid = false;
        }

        if (isNaN(manualDays) || manualDays < 1 || manualDays > this.maxWorkDays) {
            this.showError(this.manualDaysInput, `指定天数必须在1-${this.maxWorkDays}之间的整数`);
            isValid = false;
        }

        // 验证指定天数不能超过剩余工作天数
        if (isValid) {
            const remainingDays = this.maxWorkDays - workedDays;
            if (manualDays > remainingDays) {
                this.showError(this.manualDaysInput, `指定天数不能超过剩余工作天数(${remainingDays}天)`);
                isValid = false;
            }
        }

        return isValid;
    }

    performManualCalculation(workedDays, avgHours, avgMinutes, manualDays) {
        // 计算已累计工时
        const totalAvgHours = avgHours + (avgMinutes / 60);
        const accumulatedHours = workedDays * totalAvgHours;
        const remainingHours = this.totalRequiredHours - accumulatedHours;
        
        let dailyRequiredHours = 0;
        let status = '';
        let canComplete = true;

        // 边界情况处理
        if (remainingHours <= 0) {
            // 已达标
            status = '已满足月度工时要求，无需补足';
            dailyRequiredHours = 0;
            canComplete = true;
        } else {
            // 计算指定天数内每天需要打卡时长
            dailyRequiredHours = remainingHours / manualDays;
            
            if (dailyRequiredHours > 24) {
                // 无法在指定天数内完成
                status = `无法在${manualDays}天内完成，每天需要超过24小时`;
                canComplete = false;
            } else {
                const requiredHours = Math.floor(dailyRequiredHours);
                const requiredMinutes = Math.round((dailyRequiredHours - requiredHours) * 60);
                status = `在${manualDays}天内，每日需打卡${requiredHours}小时${requiredMinutes}分钟`;
                canComplete = true;
            }
        }

        return {
            specifiedDays: manualDays,
            remainingHours: this.formatTime(Math.max(0, remainingHours)),
            dailyRequiredHours: canComplete ? this.formatTime(dailyRequiredHours) : '无法完成',
            status: status,
            canComplete: canComplete
        };
    }

    displayManualResult(result) {
        // 更新结果数据
        this.manualSpecifiedDaysEl.textContent = `${result.specifiedDays} 天`;
        this.manualRemainingHoursEl.textContent = result.remainingHours;
        this.manualDailyHoursEl.textContent = result.dailyRequiredHours;

        // 显示结果区域
        this.manualResultSection.style.display = 'block';

        // 更新状态
        this.updateManualStatus(result);
    }

    updateManualStatus(result) {
        this.manualStatusEl.textContent = result.status;
        this.manualStatusEl.className = 'status';

        if (!result.canComplete) {
            this.manualStatusEl.classList.add('warning');
        } else if (result.dailyRequiredHours === '0小时0分钟') {
            this.manualStatusEl.classList.add('success');
        } else {
            this.manualStatusEl.classList.add('info');
        }
    }

    showManualStatus(message, type = 'info') {
        this.manualStatusEl.textContent = message;
        this.manualStatusEl.className = `status ${type}`;
        this.manualResultSection.style.display = 'block';
    }

    // 设置相关功能
    applySettings() {
        try {
            const customWorkDays = parseInt(this.customWorkDaysInput.value);
            const customAvgHours = parseInt(this.customAvgHoursInput.value) || 0;
            const customAvgMinutes = parseInt(this.customAvgMinutesInput.value) || 0;

            // 输入验证
            if (!this.validateSettingsInputs(customWorkDays, customAvgHours, customAvgMinutes)) {
                return;
            }

            // 应用新设置
            this.maxWorkDays = customWorkDays;
            this.requiredHoursPerDay = customAvgHours + (customAvgMinutes / 60);
            this.totalRequiredHours = this.maxWorkDays * this.requiredHoursPerDay;

            // 更新界面
            this.updateMonthlyStandard();
            this.updateInputLimits();
            this.saveSettings();

            // 显示成功提示
            this.showSettingsSuccess();

        } catch (error) {
            this.showSettingsError('应用设置时出现错误，请检查输入数据');
        }
    }

    validateSettingsInputs(customWorkDays, customAvgHours, customAvgMinutes) {
        this.clearSettingsErrors();
        let isValid = true;

        if (isNaN(customWorkDays) || customWorkDays < 1 || customWorkDays > 31) {
            this.showError(this.customWorkDaysInput, '工作天数必须在1-31之间的整数');
            isValid = false;
        }

        if (isNaN(customAvgHours) || customAvgHours < 0 || customAvgHours > 23) {
            this.showError(this.customAvgHoursInput, '小时必须在0-23之间的整数');
            isValid = false;
        }

        if (isNaN(customAvgMinutes) || customAvgMinutes < 0 || customAvgMinutes > 59) {
            this.showError(this.customAvgMinutesInput, '分钟必须在0-59之间的整数');
            isValid = false;
        }

        return isValid;
    }

    updateMonthlyStandard() {
        const hours = Math.floor(this.requiredHoursPerDay);
        const minutes = Math.round((this.requiredHoursPerDay - hours) * 60);
        const totalHours = Math.floor(this.totalRequiredHours);
        const totalMinutes = Math.round((this.totalRequiredHours - totalHours) * 60);
        
        let standardText = `月度标准：${this.maxWorkDays}天 × ${hours}小时${minutes}分钟 = ${totalHours}小时${totalMinutes}分钟`;
        this.monthlyStandardEl.textContent = standardText;
    }

    updateInputLimits() {
        // 更新已工作天数的最大值
        this.workedDaysInput.max = this.maxWorkDays;
        this.manualDaysInput.max = this.maxWorkDays;
    }

    saveSettings() {
        const settings = {
            maxWorkDays: this.maxWorkDays,
            requiredHoursPerDay: this.requiredHoursPerDay,
            totalRequiredHours: this.totalRequiredHours
        };
        localStorage.setItem('attendanceSettings', JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('attendanceSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.maxWorkDays = settings.maxWorkDays || 22;
                this.requiredHoursPerDay = settings.requiredHoursPerDay || 9.5;
                this.totalRequiredHours = settings.totalRequiredHours || (this.maxWorkDays * this.requiredHoursPerDay);
                
                // 更新设置输入框
                this.customWorkDaysInput.value = this.maxWorkDays;
                const hours = Math.floor(this.requiredHoursPerDay);
                const minutes = Math.round((this.requiredHoursPerDay - hours) * 60);
                this.customAvgHoursInput.value = hours;
                this.customAvgMinutesInput.value = minutes;
            }
        } catch (error) {
            console.log('加载设置失败，使用默认设置');
        }
    }

    showSettingsSuccess() {
        // 创建临时成功提示
        const successEl = document.createElement('div');
        successEl.className = 'settings-success';
        successEl.textContent = '设置已应用成功！';
        successEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(successEl);
        
        setTimeout(() => {
            successEl.remove();
        }, 3000);
    }

    showSettingsError(message) {
        // 创建临时错误提示
        const errorEl = document.createElement('div');
        errorEl.className = 'settings-error';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(errorEl);
        
        setTimeout(() => {
            errorEl.remove();
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new AttendanceCalculator();
});

// 添加一些实用的工具函数
function formatTime(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}小时${minutes}分钟`;
}

// 导出计算函数供外部使用（如果需要）
window.AttendanceCalculator = AttendanceCalculator;
