import {Injectable} from '@angular/core';

import * as Web3 from 'web3';

declare let require: any;
declare let window: any;

const tokenAbi = require('../abi/token.json');

@Injectable({
  providedIn: 'root'
})

export class ContractsService {
  private _account: string = null;
  private _web3: any;

  public async getAccount(): Promise<string> {
    if (typeof window.web3 !== 'undefined') {
      // Use MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Please use a dapp browser MetaMask plugin for chrome');
    }
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }
          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        });
      }) as string;
      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async createProperty(contractAddress, walletAddress, propertyAddress, ownerName, ownerEmail): Promise<any> {
    if (typeof window.web3 !== 'undefined') {
      // Use MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Please use a dapp browser MetaMask plugin for chrome');
    }
    if (this._web3) {
      const p = new Promise<any>((resolve, reject) => {
        const contractInstance = this._web3.eth.contract(tokenAbi).at(contractAddress);
        contractInstance.createProperty(walletAddress, propertyAddress, ownerName, ownerEmail, (error, result) => {
          if (!error) {
            contractInstance.PropertyTokenCreated((err, res) => {
              if (!err) {
                resolve(res.args);
              } else {
                reject(err);
              }
            });
          } else {
            reject(error);
          }
        });
      });
      return p;
    }
  }

  public async getPropertyOwnerDetails(contractAddress, propertyAddress, index): Promise<any> {
    if (typeof window.web3 !== 'undefined') {
      this._web3 = new Web3(window.web3.currentProvider);
    }
    if (this._web3) {
      const a = new Promise<any>((resolve, reject) => {
        const contractInstance = this._web3.eth.contract(tokenAbi).at(contractAddress);
        contractInstance.getPropertyOwnerDetails(propertyAddress, index, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        });
      });
      return a;
    }
  }
}
