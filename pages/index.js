import Head from 'next/head';
import Dashboard from '../public/components/dashboard/Dashboard';
import Navbar from '../public/components/navbar/Navbar';

export default function Home() {
   return (
      <div className="container">
         <Head>
            <title>Mock trade app</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <Navbar />
         <Dashboard />
      </div>
   );
}
