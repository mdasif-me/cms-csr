import { BestDeals } from '@/lib/features/root/components/best-deals';
import { FeatureProducts } from '@/lib/features/root/components/feature-products';
import { Features } from '@/lib/features/root/components/features';
import { Products } from '@/lib/features/root/components/products';
import { PromotionBanner } from '@/lib/features/root/components/promotion-banner';
import {
  CardWidget,
  CarouselWidget,
} from '@/lib/features/root/components/widgets';
import { Categories } from '../lib/features/root/components/category';

export default function Root() {
  return (
    <div>
      <div className='container mx-auto grid grid-cols-1 lg:gap-6 gap-y-3 lg:grid-cols-3 my-6'>
        <CarouselWidget />
        <CardWidget className='hidden md:flex' />
      </div>
      <div className='space-y-6'>
        <Features className='hidden md:block' />
        <BestDeals />
      </div>
      <div>
        <Categories />
        <FeatureProducts />
        <PromotionBanner />
        <Products />
      </div>
    </div>
  );
}
