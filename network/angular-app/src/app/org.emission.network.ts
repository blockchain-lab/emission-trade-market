import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.emission.network{
   export class Company extends Participant {
      companyID: string;
      name: string;
      ett: Ett;
   }
   export class Regulator extends Participant {
      regulatorID: string;
   }
   export class Ett extends Asset {
      ettID: string;
      limit: number;
      owner: Company;
   }
   export class Trade extends Transaction {
      emissionToTrade: number;
      buyer: Company;
      seller: Company;
   }
   export class GiveEtt extends Transaction {
      owner: Company;
      ett: Ett;
   }
   export class ChangeEttOwner extends Transaction {
      newOwner: Company;
      ett: Ett;
   }
// }
