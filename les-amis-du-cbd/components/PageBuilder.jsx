import Header from './Header/Header';
import Marquee from './Marquee/Marquee';
import Hero from './Hero/Hero';

const componentMap = {
    Header: Header,
    Marquee: Marquee,
    Hero: Hero
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
