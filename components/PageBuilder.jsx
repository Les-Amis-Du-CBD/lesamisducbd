import Header from './Header/Header';
import Marquee from './Marquee/Marquee';
import Hero from './Hero/Hero';
import ProductList from './ProductList/ProductList';
import WhyChooseUs from './WhyChooseUs/WhyChooseUs';
import FAQ from './FAQ/FAQ';
import BentoGrid from './BentoGrid/BentoGrid';
import Link from 'next/link';
import Footer from './Footer/Footer';
import RevealOnScroll from './RevealOnScroll/RevealOnScroll';
import Partners from './Partners/Partners';
import Quote from './Quote/Quote';
import ScrollToTop from './ScrollToTop/ScrollToTop';

const componentMap = {
    Header: Header,
    Marquee: Marquee,
    Hero: Hero,
    ProductList: ProductList,
    WhyChooseUs: WhyChooseUs,
    FAQ: FAQ,
    BentoGrid: BentoGrid,
    Partners: Partners,
    Quote: Quote,
    Footer: Footer
};

export default function PageBuilder({ sections }) {
    if (!sections) return null;

    return (
        <>
            <ScrollToTop />
            {sections.map((section, index) => {
                const Component = componentMap[section.type];
                if (!Component) {
                    console.warn(`No component found for type: ${section.type}`);
                    return null;
                }

                // Don't animate Header (it's fixed)
                if (section.type === 'Header') {
                    return <Component key={index} {...section.props} />;
                }

                return (
                    <RevealOnScroll key={index}>
                        <Component {...section.props} />
                    </RevealOnScroll>
                );
            })}
        </>
    );
}
