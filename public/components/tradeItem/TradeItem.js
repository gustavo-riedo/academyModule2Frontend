import React, { Component } from 'react';

import style from './TradeItem.module.css';

export default class TradeItem extends Component {
   render() {
      const trade = this.props.trade;

      return (
         <li className={style.listItem} key={trade.id}>
            <p className={style.typeText}>{trade.tradetype}</p>
            <p className={style.createdAtText}>{trade.createdat}</p>
            <p className={style.incomeText}>Value: {trade.income}</p>
         </li>
      );
   }
}
