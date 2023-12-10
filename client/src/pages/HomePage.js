import React from 'react';
import Cookies from 'js-cookie';

import Header from '../components/common/Header';
import Breadcrumb from '../components/common/Breadcrumb';
import Server from '../components/server/Server';
import Footer from '../components/common/Footer';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/custom.css';

const HomePage = () => {

  const servers = [
    {
      name: 'Erisium',
      playerCount: '25',
      playerSlot: '50',
      address: 'mc.erisium.com',
      serverLinks: [
        { name: 'Website', url: 'https://erisium.com/' },
        { name: 'Store', url: 'https://store.erisium.com/' },
        { name: 'Discord', url: 'https://eri.si/discord' },
        { name: 'Twitter', url: 'https://eri.si/twitter' }
      ],
      iconPath: require("../icone.svg").default
    },
    {
      name: 'Wyntale',
      playerCount: '25',
      playerSlot: '50',
      address: 'play.wyntale.fr',
      serverLinks: [
        { name: 'Website', url: 'https://wyntale.fr/' },
        { name: 'Store', url: 'https://store.wyntale.fr/' },
        { name: 'Discord', url: 'https://wyntale.fr/discord' },
        { name: 'Twitter', url: 'https://twitter.com/wyntale' }
      ],
      iconPath: require("../icone.svg").default
    }
  ];

  return (
    <div className='bg-custom-dark bg-custom-dark text-white flex flex-col min-h-screen'>

      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Content */}
      <div className='bg-custom-dark flex-grow'>
        <div className='mx-auto lg:px-8 max-w-7xl grid md:grid-cols-2 gap-8'>

          {/* Server cards */}
          {servers.map((server, index) => (
            <Server key={index} server={server} />
          ))}
          
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;
