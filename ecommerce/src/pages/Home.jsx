
import { useContext, useEffect, useMemo, useState } from 'react';
import BestSeller from '../components/BestSeller'
import Hero from '../components/Hero'
import OurPolicy from '../components/OurPolicy'
import { ShopContext } from '../context/ShopContext';



const Home = () => {
  const { products } = useContext(ShopContext);
  const [ready, setReady] = useState(false);

  const bestSellerImages = useMemo(() => {
    if (!products || products.length === 0) return [];
    const best = products.filter((item) => item?.name).slice(0, 4);
    return best
      .map((p) => Array.isArray(p?.image) ? p.image[0] : null)
      .filter((src) => typeof src === 'string' && src.length > 0);
  }, [products]);

  useEffect(() => {
    if (!bestSellerImages.length) {
    
      if (products && products.length > 0) {
        setReady(true);
      }
      return;
    }

    let isCancelled = false;
    const preload = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });

    Promise.all(bestSellerImages.map(preload)).then(() => {
      if (!isCancelled) setReady(true);
    });

    return () => {
      isCancelled = true;
    };
  }, [bestSellerImages, products]);

  if (!ready) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <BestSeller />
      <OurPolicy />
    </div>
  );
}

export default Home