class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == undefined)
            throw Error();

        this.config = config;
        this.reset();
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {return this.state;}

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state] == undefined)
            throw Error();
        
        this.undoStack.push(this.state);
        this.redoStack = [];
        this.state = state;

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.config.states[this.state].transitions[event];

        if (newState === undefined)
            throw Error();

        this.undoStack.push(this.state);
        this.redoStack = [];
        this.state = newState;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {this.state = this.config["initial"];}

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let res = [];
        for (const state in this.config.states) {
            if (event == undefined || event in this.config.states[state].transitions)
                res.push(state);
        }

        return res;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.undoStack.length)
            return false;
        
        this.redoStack.push(this.state);
        this.state = this.undoStack.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.redoStack.length)
            return false;

        this.state = this.redoStack.pop();
        return true;      
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undoStack = [];
        this.redoStack = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
