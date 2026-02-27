import Header from './Header/Header';
import Marquee from './Marquee/Marquee';
import Hero from './Hero/Hero';
import ProductList from './ProductList/ProductList';
import WhyChooseUs from './WhyChooseUs/WhyChooseUs';
import FAQ from './FAQ/FAQ';

import Link from 'next/link';
import Footer from './Footer/Footer';

import Partners from './Partners/Partners';
import Quote from './Quote/Quote';

import QualityBanner from './QualityBanner/QualityBanner';
import PartnersNetwork from './PartnersNetwork/PartnersNetwork';
import InteractiveMapWrapper from './InteractiveMap/InteractiveMapWrapper';
import JoinUs from './JoinUs/JoinUs';
import ScrollReveal from './ScrollReveal/ScrollReveal';
import RichText from './RichText/RichText';
import ContentHero from './ContentHero/ContentHero';
import ImageBlock from './ImageBlock/ImageBlock';


const componentMap = {
    Header: Header,
    Marquee: Marquee,
    Hero: Hero,
    ContentHero: ContentHero,
    ImageBlock: ImageBlock,
    QualityBanner: QualityBanner,
    ProductList: ProductList,
    WhyChooseUs: WhyChooseUs,
    PartnersNetwork: PartnersNetwork,
    InteractiveMap: InteractiveMapWrapper,
    JoinUs: JoinUs,
    FAQ: FAQ,
    Partners: Partners,
    Quote: Quote,
    RichText: RichText,
    Footer: Footer
};


export default function PageBuilder({ sections }) {
    if (!sections) return null;

    return (
        <>
            {sections.map((section, index) => {
                // If the CMS flag explicitly says to hide this component
                if (section.props && section.props.isVisible === false) return null;

                const Component = componentMap[section.type];
                if (!Component) {
                    console.warn(`No component found for type: ${section.type}`);
                    return null;
                }

                // Don't animate Header (it's fixed)
                if (section.type === 'Header') {
                    return <Component key={index} {...section.props} />;
                }

                // Optimization: Don't animate Hero to preserve LCP
                if (section.type === 'Hero') {
                    return <Component key={index} {...section.props} />;
                }

                return (
                    <ScrollReveal key={index} animation="fade-up" duration={700} delay={100}>
                        <Component {...section.props} />
                    </ScrollReveal>
                );
            })}
        </>
    );
}
