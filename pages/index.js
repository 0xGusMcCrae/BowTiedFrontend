import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
//import ManualHeader from '../components/ManualHeader';
import Header from "../components/Header";
import MintNft from "../components/MintNft"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Buvarian Buttheads</title>
        <meta name="description" content="The Greatest NFT Ever Created" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* header / connect button / nav bar */}
      <Header />
      <MintNft />
    </div>


  )
}
