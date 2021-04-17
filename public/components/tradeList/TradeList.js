import React, { Component } from 'react';
import TradeItem from '../tradeItem/TradeItem';

import style from './Tradelist.module.css';

export default class TradeList extends Component {
   render() {
      const tradeList = this.props.tradeList;

      return (
         <ul className={style.tradeList}>
            {tradeList.reverse().map((trade) => (
               <TradeItem trade={trade} />
            ))}
         </ul>
      );
   }
}
