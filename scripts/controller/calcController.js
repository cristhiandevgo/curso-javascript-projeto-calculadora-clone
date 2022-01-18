class CalcController{
    constructor(){
        this._lastOperator = '';
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastNumber = '';
        this._operation = [];
        this._locale = navigator.language;
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text); // Para evitar colar texto
        });
    }

    copyToClipboard(){
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input); // Necessário para inserir no body

        input.select();

        document.execCommand('Copy');

        input.remove();
    }

    initialize(){
        // setInterval = repete a cada x ms
        // setTimeout = espera x ms e executa

        this.setDisplayDateTime();
        
        let interval = setInterval(()=>{
            this.setDisplayDateTime();
            
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });

    }

    toggleAudio(){ // Se for true, muda pra falso e vice versa
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){
        
        document.addEventListener('keyup', e=>{
            this.playAudio();

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.cancelEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }

    addEventListenerAllMod(element, events, fn){
        //String to array
        // divido a string em um array e em cada evento,
        // executo o evento: click, drag...
        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    cancelEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        //alert('getLastOperation: '+this._operation);
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        //alert('setLastOperation: '+value);
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
        // Verifica se o usuário substituiu o operador
        // Verifica no array se o valor é um operador
        //alert('isOperator: '+value);
        return (['+', '-', '*', '/', '%', ].indexOf(value)>-1);
    }

    /*makecalculation(){
        this._operation.forEach((v)=>{
            alert(v);
        });
    }*/

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length>3){
            this.calc();
        }
    }

    getResult(){
        try{
            return eval(this._operation.join('')); // transforma em string com join, roda a string como script com eval
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 0);
        }
        
    }

    calc(){
        /*
        Exemplo
        1+1+
        remove o +
        calcula o 1+1
        operation[2, +]
        se for simbolo, nao fazer isso
        */

        // Se continuar clicando no igual, fazer o cálcula repetindo a última operação e numero
        // Ex: 2+3+= = 5 / = 10 / = 15
        // Ou
        // Ex: 2+3= 5 / = 8 / = 11

        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){ // Se continuar clicando em = / Solução continuar
            let firstItem = this._operation[0]; // Mantem o primeiro item como primeiro
            this._operation = [firstItem, this._lastOperator, this._lastNumber]; // Segundo deve ser o último operador
            
        }

        if(this._operation.length > 3){ // Só posso remover o ultimo da operação se nao for =
            last = this._operation.pop(); // remove terceira operação para calcular pares. Ex 1+1- -> Calcula o 1+1 primeiro
            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){ // caso de continuar 2+3 e continuar clicando em igual
            this._lastNumber = this.getLastItem(false); // Pegar o símbolo
        }
                
        let result = this.getResult();
        
        // Ex: 200 x 10
        if(last == '%'){ // Ex: 200 x 10% = 20
            result /= 100;
            this._operation = [result]; // this._operation = [20];
        }else{ // Ex: 200 * 10 = 2000
            // Ex: operation[0] = 1+1 e operation[1] = +
            
            this._operation = [result]; // this._operation = [2000];
            if(last) this._operation.push(last);
        }
        
        this.setLastNumberToDisplay();
        

    }

    getLastItem(isOperator = true){ // para pegar o numero, setar false
        let lastItem;
        // this._operation.length-1 = Total de itens na operação
        for(let i = this._operation.length-1; i>=0; i--){
                if(this.isOperator(this._operation[i]) == isOperator){ // Se não for operador, achei um numero
                    lastItem = this._operation[i];
                    break;
                }
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0; // Se o array for vazio, exibe 0

        this.displayCalc = lastNumber;
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')>-1) return;

        if(this.isOperator(lastOperation) || !lastOperation){ // Ex: 2+ .5 que é 2+0.5
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    // Verificação se o caractere for número,
    // para concatenar valores ao invés de separar
    // ex: Quero adicionar 111, ele concatena os uns ao
    // invés de adicionar 1, 1, 1
    addOperation(value){

        // isNan = is not a number
        if (isNaN(this.getLastOperation())){
            // String
            if(this.isOperator(value)){
                // Trocar o operador
                // Se for operador, substitua
                this.setLastOperation(value);
            }else{ // undefined entra aqui
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }else{
                // Number
                let newValue = this.getLastOperation().toString() + value.toString(); // Converter pra string para concatenar os números
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }

        }

        //console.log(this._operation);
    }

    setError(){
        this.displayCalc = 'Error';
    }


    execBtn(value){
        this.playAudio();
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
            break;

            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){

        /* selecionando apenas 1 click
        let buttons = document.querySelectorAll('#buttons>g.btn-9');
        // Parãmetro do arrow function e=>
            addEventListener('click', e=>{
                console.log(e);
            });
        */


        let buttons = document.querySelectorAll('#buttons>g,#parts>g');

        buttons.forEach((btn, index)=>{
            this.addEventListenerAllMod(btn, 'click drag', e=>{
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
                this.getLastOperation();
            });

            this.addEventListenerAllMod(btn, 'mouseover mouseup mousedown ', e=>{
                btn.style.cursor = 'pointer';
            });
        })
    }

    setDisplayDateTime(){
        //seters
        // Entra no set dateEl e no get currentDate
        this.dateEl = this.currentDate.toLocaleDateString(this._locale);
        this.timeEl = this.currentDate.toLocaleTimeString(this._locale);
    }

    /* geters and setters */

    // currentDate
    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }

    // displayCalc
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        if(value.toString().length > 10){ // .length é pra string, necessário converter
            this.setError();
            return;
        }
        this._displayCalcEl.innerHTML = value;
    }

    // dateEl
    get dateEl(){
        return this._dateEl;
    }
    set dateEl(value){
        this._dateEl.innerHTML = value;
    }

    // timeEl
    get timeEl(){
        return this._timeEl;
    }
    set timeEl(value){
        this._timeEl.innerHTML = value;
    }

}
