import Head from 'next/head';
import Navbar from '../public/components/navbar/Navbar';
import History from '../public/components/history/History';

export default function history() {
   return (
      <div className="container">
         <Head>
            <title>Mock trade app</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <Navbar />
         <History />
      </div>
   );
}
