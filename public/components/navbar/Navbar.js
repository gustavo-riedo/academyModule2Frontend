import React, { Component } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { i18n } from '../../../src/translate/i18n';

import style from './Navbar.module.css';

export default class Navbar extends Component {
   render() {
      return (
         <nav className={style.navbar}>
            <ul className={style.navbarList}>
               <li className={style.navbarItem}>
                  <Link href="/">
                     <a className={style.navbarLink}>
                        <Image
                           src="/images/dashboard.svg"
                           height={40}
                           width={100}
                           alt="Dashboard link"
                        />
                        {i18n.t('titles.dashboard')}
                     </a>
                  </Link>
               </li>
               <li className={style.navbarItem}>
                  <Link href="/history">
                     <a className={style.navbarLink}>
                        <Image
                           src="/images/history.svg"
                           height={40}
                           width={100}
                           alt="History link"
                        />
                        {i18n.t('titles.history')}
                     </a>
                  </Link>
               </li>
               <li className={style.navbarItem}>
                  <Link href="https://google.com">
                     <a className={style.navbarLink}>
                        <Image
                           src="/images/logout.svg"
                           height={40}
                           width={100}
                           alt="Logout link"
                        />
                        {i18n.t('titles.logout')}
                     </a>
                  </Link>
               </li>
            </ul>
         </nav>
      );
   }
}
