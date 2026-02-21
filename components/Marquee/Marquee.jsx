import styles from './Marquee.module.css';

export default function Marquee({ text, speed }) {
    // Array to repeat the text multiple times so it covers wide screens
    // even if the user typed a very short word like "test"
    const repeatedText = Array(15).fill(`${text} \u00A0 \u2022 \u00A0`);

    return (
        <div className={styles.marqueeContainer}>
            <div className={styles.marqueeContent} style={{ animationDuration: `${speed || 20}s` }}>
                <span className={styles.track}>
                    {repeatedText.join('')}
                </span>
                <span className={styles.track}>
                    {repeatedText.join('')}
                </span>
            </div>
        </div>
    );
}
