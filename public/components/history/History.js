import axios from 'axios';
import React, { Component } from 'react';
import { i18n } from '../../../src/translate/i18n';

import style from './History.module.css';
import TradeList from '../tradeList/TradeList';

const userID = 384;

export default class History extends Component {
   state = {
      userHistory: [],
   };

   componentDidMount() {
      this.updateUserHistory(userID);
   }

   updateUserHistory = async (id) => {
      const rawHistory = await axios.get(
         'http://localhost:5000/users/history/' + id
      );
      const userHistory = rawHistory.data;

      this.setState({
         userHistory: userHistory,
      });
   };

   render() {
      return (
         <main className={style.main}>
            <div className={style.mainCard}>
               <h1>{i18n.t('titles.history')}</h1>
               <TradeList tradeList={this.state.userHistory.slice(-15)} />
            </div>
         </main>
      );
   }
}
