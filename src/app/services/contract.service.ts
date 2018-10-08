import {Injectable} from '@angular/core';
import CONFIG from '@config';
import * as Web3 from 'web3';

declare let require: any;
declare let window: any;

const tokenAbi = require('../abi/token.json');

@Injectable({
  providedIn: 'root'
})

export class ContractsService {
  public async getAccount(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (typeof window.web3 !== 'undefined') {
        const web3 = new Web3(window.web3.currentProvider);
        web3.eth.getAccounts((err, accs) => {
          if (err) {
            reject(err);
            return;
          }

          if (accs.length === 0) {
            reject(new Error('Please login to your Metamask and select one account to continue.'));
            return;
          }
          const account = accs[0];
          resolve(account);
        });
      } else {
        reject(new Error('Please login to your Metamask and select one account to continue.'));
      }
    });
  }

  public async createProperty(contractAddress, walletAddress, propertyAddress, ownerName, ownerEmail): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (typeof window.web3 !== 'undefined') {
        const web3 = new Web3(window.web3.currentProvider);
        web3.eth.defaultAccount = walletAddress;
        const contractInstance = web3.eth.contract(tokenAbi).at(contractAddress);
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
      } else {
        reject(new Error('Please login to your Metamask and select one account to continue.'));
      }
    });
  }

  public async getPropertyOwnerDetails(contractAddress, propertyAddress, index): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.blockchainAPIURL));
      const contractInstance = web3.eth.contract(tokenAbi).at(contractAddress);
      contractInstance.getPropertyOwnerDetails(propertyAddress, index, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  }

  public async getRecentlyCreatedPropertyAddress1(contractAddress): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.blockchainAPIURL));
      const contractInstance = web3.eth.contract(tokenAbi).at(contractAddress);
      contractInstance.getRecentlyCreatedPropertyAddress((error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  }
}
