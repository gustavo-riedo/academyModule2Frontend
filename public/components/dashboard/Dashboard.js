// External imports
import axios from 'axios';
import React, { Component } from 'react';
import Image from 'next/image';
import { i18n } from '../../../src/translate/i18n';

// Internal imports
import { subscribeToRatesUpdate } from '../../connections/socketClient';
import style from './Dashboard.module.css';
import TradeList from '../tradeList/TradeList';

const userID = 384; // PLACEHOLDER
const databaseAddress = 'http://localhost:5000/';

export default class Dashboard extends Component {
   constructor() {
      super();
      this.state = {
         username: i18n.t('errors.noUsername'),
         email: i18n.t('errors.noEmail'),
         USDbal: i18n.t('errors.noValue'),
         GBPbal: i18n.t('errors.noValue'),
         userHistory: [],

         USDrate: i18n.t('messages.loading'),
         GBPrate: i18n.t('messages.loading'),

         userInput: '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   componentDidMount() {
      this.updateUserData(userID);
      subscribeToRatesUpdate((err, data) => {
         this.setState({ USDrate: data.USDtoGBP, GBPrate: data.GBPtoUSD });
         if (typeof window !== 'undefined') {
            localStorage.setItem('USDrate', data.USDtoGBP);
            localStorage.setItem('GBPrate', data.GBPtoUSD);
         }
      });
   }

   handleChange(event) {
      this.setState({ userInput: event.target.value });
      this.updateUserData(userID);
      console.log(this.state.userInput);
   }
   handleSubmit(event, type) {
      event.preventDefault();
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

   getCache = async () => {
      if (typeof window !== 'undefined') {
         this.setState({
            USDrate: localStorage.getItem('USDrate'),
            GBPrate: localStorage.getItem('GBPrate'),
         });
      }
   };

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
               alert(i18n.t('errors.invalidValue'));
            }
            if (error.response.data == 'Not enough balance') {
               alert(i18n.t('errors.notEnoughMoney'));
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
      if (res == 'Invalid value') alert(i18n.t('errors.invalidValue'));
   };

   render() {
      this.updateUserData(userID);
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
                        {i18n.t('titles.name')}
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
                        {i18n.t('titles.USDtoGBP')}
                     </label>
                     <label className={style.labelLeft}>
                        {i18n.t('titles.value')}
                        <input
                           type="number"
                           defaultValue={0.0}
                           onChange={this.handleChange}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="submit"
                        value={i18n.t('buttons.buyGBP')}
                        className={style.inputButton}
                     />
                  </form>
                  <form
                     className={style.tradeForm}
                     onSubmit={(e) => this.handleSubmit(e, 'deposit')}
                  >
                     <label className={style.labelLeft}>
                        {i18n.t('titles.deposit')}
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
                        value={i18n.t('titles.deposit')}
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
                        {i18n.t('titles.GBPtoUSD')}
                     </label>
                     <label className={style.labelLeft}>
                        {i18n.t('titles.value')}
                        <input
                           type="number"
                           defaultValue={0.0}
                           onChange={this.handleChange}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="submit"
                        value={i18n.t('buttons.buyUSD')}
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
