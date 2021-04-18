import React, { Component } from 'react';
import { i18n } from '../../../src/translate/i18n';

import style from './TradeItem.module.css';

export default class TradeItem extends Component {
   render() {
      const trade = this.props.trade;

      return (
         <li className={style.listItem} key={trade.id}>
            <p className={style.typeText}>{trade.tradetype}</p>
            <p className={style.createdAtText}>{trade.createdat}</p>
            <p className={style.incomeText}>
               {i18n.t('titles.value')}: {trade.income}
            </p>
         </li>
      );
   }
}
