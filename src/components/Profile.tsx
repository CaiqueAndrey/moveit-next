import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const { level } = useContext(ChallengesContext);

    return (
        <div className={styles.profileContainer}>
            <img 
                src="https://media-exp1.licdn.com/dms/image/C4D03AQFYTGeREDbdxg/profile-displayphoto-shrink_200_200/0/1566788552341?e=1619654400&v=beta&t=6A_H6kCSKUu3G6atDD2fcau_aIQRJwgMEflSaV3WZCQ" 
                alt="Caique Fuzaite"
            />
            <div>
                <strong>Caique Fuzaite</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
            </div>
        </div>
    );
}