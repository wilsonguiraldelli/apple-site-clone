import { FC, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import {heroVideo, smallHeroVideo} from '../utils';

const Hero: FC = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)
  
  const handleVideoSrcSet = () => {
    if (window.innerWidth < 760) return setVideoSrc(smallHeroVideo)
      setVideoSrc(heroVideo)
  }

  useGSAP(() => {
    gsap.to('#hero', {
      opacity: 1,
      delay: 1.5
    });

    gsap.to('#cta', {
      opacity: 1,
      y: -50,
      delay: 2
    })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet);

    return () => {
      window.removeEventListener('resize', handleVideoSrcSet);
    }
  }, [])

  return <section className='w-full nav-height bg-black relative'>
    <div className='h-5/6 w-full flex-center flex-col'>
      <p id="hero" className='hero-title'>
        Iphone 15 Pro
      </p>
      <div className='md:w-10/12 w-9/12'>
        <video className='pointer-events-none' autoPlay muted playsInline key={videoSrc}>
          <source src={videoSrc}  type='video/mp4'/>
        </video>
      </div>
    </div>

    <div id="cta" className='flex flex-col items-center opacity-0 translate-y-20'>
      <a href='#highlights' className='btn'>Comprar</a>
      <p>R$ 5.800,00 no pix</p>
    </div>
  </section>;
};

export default Hero;
