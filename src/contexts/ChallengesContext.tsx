import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    //props recebidas do index
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

//passando o formato do contexto estabelecido na interface
export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({
    children,
    ...rest
} : ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [ currentExperience, setCurrentExperience ] = useState(rest.currentExperience ?? 0);
    const [ challengesCompleted, setChallengesCompleted ] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
    
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
    
    useEffect(() => {
        Notification.requestPermission();
    }, []);
    //array de dependencia vazio = efeito uma unica vez assim que o componente for exibido em tela

    //setando contexts nos cookies
    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));

    },[level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission === "granted"){
            new Notification('Novo desafio !',{
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if(!activeChallenge){
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider 
            value={{
                level, 
                levelUp, 
                currentExperience, 
                challengesCompleted,
                activeChallenge,
                startNewChallenge,
                resetChallenge, 
                experienceToNextLevel,
                completeChallenge, 
                closeLevelUpModal
                }}
        >
            {children}
            
            {isLevelUpModalOpen && <LevelUpModal />}
            {/*por ser chamado pela function level up o challengeprovider que vai abrir o modal */}
        </ChallengesContext.Provider>
    );
}