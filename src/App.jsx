import { useEffect, useState } from "react";
import cards from "./data/cards.json";
import Button from "./Button";

export default function App() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [clickedCards, setClickedCards] = useState(new Set());
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [activeCards, setActiveCards] = useState([]);

    const DIFFICULTY_COUNTS = {
        easy: 5,
        normal: 10,
        hard: 15
    }
    const handleCardClick = (card) => {
        if (clickedCards.has(card.id)) {
            setIsGameOver(true);
        } else {
            setClickedCards((previousCards) => 
                new Set(previousCards).add(card.id)
            );

            setScore((previousScore) => previousScore + 1);
            setActiveCards(shuffleCards(activeCards));
        }
    }

    const handleStartGame = (difficulty) => {
        setActiveCards(getRandomCards(cards, DIFFICULTY_COUNTS[difficulty]));
        setSelectedDifficulty(difficulty);
        setScore(0);
        setIsGameOver(false);
        setClickedCards(new Set());
    }

    const handleTryAgain = () => {
        setActiveCards(shuffleCards(activeCards));
        setScore(0);
        setIsGameOver(false);
        setClickedCards(new Set());
    }

    const getRandomCards = (cards, count) => {
        const shuffledCards = shuffleCards(cards);
        return shuffledCards.slice(0, count);
    }

    useEffect(() => {
        if (isGameOver && score > highScore) {
            setHighScore(score);
        }
    }, [isGameOver, score, highScore])

    const shuffleCards = (cards) => {
        const shuffledCards = [...cards];
        for (let i = cards.length - 1; i >= 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }

        return shuffledCards;
    }

    return (
        <>
            <Button onClick={() => handleStartGame("easy")}>Easy</Button>
            <Button onClick={() => handleStartGame("normal")}>Normal</Button>
            <Button onClick={() => handleStartGame("hard")}>Hard</Button>
        </>
    )
}