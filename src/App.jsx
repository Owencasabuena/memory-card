import { useState } from "react";
import cards from "./data/cards.json";
import Button from "./Button";

const DIFFICULTY_COUNTS = {
    easy: 5,
    normal: 10,
    hard: 15,
};

const shuffleCards = (cardsToShuffle) => {
    const shuffledCards = [...cardsToShuffle];

    for (let i = shuffledCards.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    return shuffledCards;
};

const getRandomCards = (allCards, count) => {
    const shuffledCards = shuffleCards(allCards);
    return shuffledCards.slice(0, count);
};

export default function App() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [clickedCards, setClickedCards] = useState(new Set());
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [activeCards, setActiveCards] = useState([]);

    const handleCardClick = (card) => {
        if (clickedCards.has(card.id)) {
            setHighScore((previousHighScore) => Math.max(previousHighScore, score));
            setIsGameOver(true);
            return;
        }

        setClickedCards((previousCards) => new Set(previousCards).add(card.id));
        setScore((previousScore) => previousScore + 1);
        setActiveCards((previousCards) => shuffleCards(previousCards));
    };

    const handleStartGame = (difficulty) => {
        setActiveCards(getRandomCards(cards, DIFFICULTY_COUNTS[difficulty]));
        setSelectedDifficulty(difficulty);
        setScore(0);
        setIsGameOver(false);
        setClickedCards(new Set());
    };

    const handleTryAgain = () => {
        setActiveCards((previousCards) => shuffleCards(previousCards));
        setScore(0);
        setIsGameOver(false);
        setClickedCards(new Set());
    };

    const handleGoToMenu = () => {
        setSelectedDifficulty(null);
        setActiveCards([]);
        setScore(0);
        setIsGameOver(false);
        setClickedCards(new Set());
    };

    if (isGameOver) {
        return (
            <>
                <p>Game Over</p>
                <p>Score: {score}</p>
                <p>High Score: {highScore}</p>
                <Button onClick={handleTryAgain}>Try Again</Button>
                <Button onClick={handleGoToMenu}>Main Menu</Button>
            </>
        );
    }

    if (!selectedDifficulty) {
        return (
            <>
                <Button onClick={() => handleStartGame("easy")}>Easy</Button>
                <Button onClick={() => handleStartGame("normal")}>Normal</Button>
                <Button onClick={() => handleStartGame("hard")}>Hard</Button>
            </>
        );
    }

    return (
        <>
            <p>Score: {score}</p>
            <p>High Score: {highScore}</p>
            {activeCards.map((card) => (
                <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(card)}
                >
                    <img src={card.image} alt={card.name} />
                    <span>{card.name}</span>
                </button>
            ))}
        </>
    );
}