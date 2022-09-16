import DepositWrapper from './Deposit';


export default class StarknetWrapper {
    depositInstance: any;
    loanInstance: any;
    
    getDepositInstance() {
        if (!this.depositInstance) {
            this.depositInstance = new DepositWrapper();
        }
        return this.depositInstance;
    }

    getLoanInstance() {
    if (!this.loanInstance) {
      this.loanInstance = new LoanWrapper();
    }
    return this.loanInstance;
    }
}