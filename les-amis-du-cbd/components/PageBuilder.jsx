import Header from './Header/Header';
import Marquee from './Marquee/Marquee';
import Hero from './Hero/Hero';
import ProductList from './ProductList/ProductList';
import WhyChooseUs from './WhyChooseUs/WhyChooseUs';
import FAQ from './FAQ/FAQ';
import BentoGrid from './BentoGrid/BentoGrid';
import Link from 'next/link';
import Footer from './Footer/Footer';

const componentMap = {
    Header: Header,
    Marquee: Marquee,
    Hero: Hero,
    ProductList: ProductList,
    WhyChooseUs: WhyChooseUs,
    FAQ: FAQ,
    BentoGrid: BentoGrid,
    Footer: Footer
};

export default function PageBuilder({ sections }) {
    if (!sections) return null;

    return (
        <>
            {sections.map((section, index) => {
                const Component = componentMap[section.type];
                if (!Component) {
                    console.warn(`No component found for type: ${section.type}`);
                    return null;
                }
                return <Component key={index} {...section.props} />;
            })}
        </>
    );
}
