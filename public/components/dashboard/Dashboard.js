import axios from 'axios';
import React, { Component, useState } from 'react';
import Image from 'next/image';

import { subscribeToRatesUpdate } from '../../connections/socketClient';
import style from './Dashboard.module.css';
import TradeList from '../tradeList/TradeList';

const userID = 383;
const databaseAddress = 'http://localhost:5000/';

export default class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         username: 'No username available',
         email: 'No email available',
         USDbal: 'No value available',
         GBPbal: 'No value available',
         userHistory: [],

         USDrate: 'Loading...',
         GBPrate: 'Loading...',

         userInput: '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   componentDidMount() {
      this.updateUserData(userID);
      subscribeToRatesUpdate((err, data) =>
         this.setState({ USDrate: data.USDtoGBP, GBPrate: data.GBPtoUSD })
      );
   }

   handleChange(event) {
      this.setState({ userInput: event.target.value });
      console.log(this.state.userInput);
   }
   handleSubmit(event, type) {
      // event.preventDefault();
      if (type == 'USD to GBP') {
         this.createOperation(
            'USD to GBP',
            this.state.userInput,
            this.state.USDrate
         );
      } else if (type == 'GBP to USD') {
         this.createOperation(
            'GBP to USD',
            this.state.userInput,
            this.state.GBPrate
         );
      } else if (type == 'deposit') {
         this.depositAmount(this.state.userInput);
      }

      this.updateUserData(userID);
   }

   updateUserData = async (id) => {
      const rawUserdata = await axios.get(databaseAddress + 'users/' + id);
      const userData = rawUserdata.data;

      const rawHistory = await axios.get(
         databaseAddress + 'users/history/' + id
      );
      const userHistory = rawHistory.data;

      this.setState({
         username: userData.username,
         email: userData.email,
         USDbal: userData.accbalanceusd,
         GBPbal: userData.accbalancegbp,
         userHistory: userHistory,
      });
   };

   createOperation = async (type, income, rate) => {
      const operationData = {
         tradetype: type,
         income: income,
         rate: rate,
         userid: userID,
      };
      await axios
         .post(databaseAddress + 'operations', operationData)
         .catch((error) => {
            console.log(error);
            if (error.response.data == 'Invalid value') {
               alert('Invalid value');
            }
            if (error.response.data == 'Not enough balance') {
               alert('Not enough balance');
            }
         });
   };

   depositAmount = async (value) => {
      const depositData = {
         accbalanceusd: Number(this.state.USDbal) + Number(value),
         accbalancegbp: this.state.GBPbal,
      };

      console.log(depositData);

      const res = await axios.patch(
         databaseAddress + 'users/' + userID,
         depositData
      );
      if (res == 'Invalid value') alert('Invalid value');
   };

   render() {
      return (
         <main className={style.main}>
            <div className={style.mainCard}>
               <section className={style.profileSection}>
                  <Image
                     className={style.ppImage}
                     src="/images/defaultPP.jpg"
                     height={150}
                     width={150}
                     alt="Dashboard link"
                  />
                  <div className={style.userData}>
                     <label className={style.labelLeftMargin}>
                        Name
                        <p className={style.labelValue}>
                           {this.state.username}
                        </p>
                     </label>
                     <label className={style.labelLeftMargin}>
                        Email
                        <p className={style.labelValue}>{this.state.email}</p>
                     </label>
                  </div>
                  <div className={style.userBalance}>
                     <label className={style.labelRight}>
                        USD
                        <p className={style.labelValue}>{this.state.USDbal}</p>
                     </label>
                     <label className={style.labelRight}>
                        GBP
                        <p className={style.labelValue}>{this.state.GBPbal}</p>
                     </label>
                  </div>
               </section>
               <section className={style.tradeSection}>
                  <form
                     className={style.tradeForm}
                     onSubmit={(e) => this.handleSubmit(e, 'USD to GBP')}
                  >
                     <label className={style.label}>
                        <p className={style.tradeRate}>
                           {parseFloat(this.state.USDrate).toFixed(4)}
                        </p>
                        USD to GBP rate
                     </label>
                     <label className={style.labelLeft}>
                        Value
                        <input
                           type="number"
                           defaultValue={0.0}
                           onChange={this.handleChange}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="submit"
                        value="Buy GBP"
                        className={style.inputButton}
                     />
                  </form>
                  <form
                     className={style.tradeForm}
                     onSubmit={(e) => this.handleSubmit(e, 'deposit')}
                  >
                     <label className={style.labelLeft}>
                        Deposit
                        <input
                           type="number"
                           defaultValue={0.0}
                           onChange={this.handleChange}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="submit"
                        onChange={this.handleChange}
                        value="Deposit"
                        className={style.inputButton}
                     />
                  </form>
                  <form
                     className={style.tradeForm}
                     onSubmit={(e) => this.handleSubmit(e, 'GBP to USD')}
                  >
                     <label className={style.label}>
                        <p className={style.tradeRate}>
                           {parseFloat(this.state.GBPrate).toFixed(4)}
                        </p>
                        GBP to USD rate
                     </label>
                     <label className={style.labelLeft}>
                        Value
                        <input
                           type="number"
                           defaultValue={0.0}
                           onChange={this.handleChange}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="submit"
                        value="Buy USD"
                        className={style.inputButton}
                     />
                  </form>
               </section>
               <section className={style.recentSection}>
                  <TradeList tradeList={this.state.userHistory.slice(-5)} />
               </section>
            </div>
         </main>
      );
   }
}
