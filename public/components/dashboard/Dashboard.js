import axios from 'axios';
import React, { Component } from 'react';
import Image from 'next/image';

import style from './Dashboard.module.css';
import TradeList from '../tradeList/TradeList';

const userID = 381;

export default class Dashboard extends Component {
   state = {
      username: 'No username available',
      email: 'No email available',
      USDbal: 'No value available',
      GBPbal: 'No value available',
      userHistory: [],
   };

   componentDidMount() {
      this.updateUserData(userID);
   }

   updateUserData = async (id) => {
      const rawUserdata = await axios.get('http://localhost:5000/users/' + id);
      const userData = rawUserdata.data;

      const rawHistory = await axios.get(
         'http://localhost:5000/users/history/' + id
      );
      const userHistory = rawHistory.data;

      console.log(userHistory);

      this.setState({
         username: userData.username,
         email: userData.email,
         USDbal: userData.accbalanceusd,
         GBPbal: userData.accbalancegbp,
         userHistory: userHistory,
      });
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
                  <form className={style.tradeForm}>
                     <label className={style.label}>
                        <p className={style.tradeRate}>1.23</p>
                        USD to GBP rate
                     </label>
                     <label className={style.labelLeft}>
                        Value
                        <input
                           type="number"
                           defaultValue={0.0}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="button"
                        value="Buy GBP"
                        className={style.inputButton}
                     />
                  </form>
                  <form className={style.tradeForm}>
                     <label className={style.labelLeft}>
                        Deposit
                        <input
                           type="number"
                           defaultValue={0.0}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="button"
                        value="Deposit"
                        className={style.inputButton}
                     />
                  </form>
                  <form className={style.tradeForm}>
                     <label className={style.label}>
                        <p className={style.tradeRate}>1.23</p>
                        GBP to USD rate
                     </label>
                     <label className={style.labelLeft}>
                        Value
                        <input
                           type="number"
                           defaultValue={0.0}
                           className={style.inputNumber}
                        />
                     </label>
                     <input
                        type="button"
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
