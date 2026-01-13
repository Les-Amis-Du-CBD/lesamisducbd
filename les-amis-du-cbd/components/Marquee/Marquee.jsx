import styles from './Marquee.module.css';

export default function Marquee({ text, speed, backgroundColor, textColor }) {
    return (
        <div
            className={styles.marqueeContainer}
            style={{ backgroundColor: backgroundColor || 'var(--accent-mint)', color: textColor || 'black' }}
        >
            <div className={styles.track} style={{ animationDuration: `${speed || 20}s` }}>
                {/* Duplicate text to create infinite effect */}
                <span className={styles.content}>{text} &nbsp; • &nbsp; </span>
                <span className={styles.content}>{text} &nbsp; • &nbsp; </span>
                <span className={styles.content}>{text} &nbsp; • &nbsp; </span>
                <span className={styles.content}>{text} &nbsp; • &nbsp; </span>
            </div>
        </div>
    );
}
