import React, { Component } from 'react';

import style from './TradeItem.module.css';

export default class TradeItem extends Component {
   render() {
      const trade = this.props.trade;
      const index = this.props.index;

      return (
         <li key={index} className={style.listItem}>
            <p className={style.typeText}>{trade.tradetype}</p>
            <p className={style.createdAtText}>{trade.createdat}</p>
            <p className={style.incomeText}>Value: {trade.income}</p>
         </li>
      );
   }
}
