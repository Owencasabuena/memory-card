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
    const [isWon, setIsWon] = useState(false);
    const [clickedCards, setClickedCards] = useState(new Set());
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [activeCards, setActiveCards] = useState([]);
    const [flippedCardId, setFlippedCardId] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);

    const handleCardClick = (card) => {
        if (isShuffling) {
            return;
        }

        if (clickedCards.has(card.id)) {
            setHighScore((previousHighScore) => Math.max(previousHighScore, score));
            setIsGameOver(true);
            return;
        }

        setClickedCards((previousCards) => new Set(previousCards).add(card.id));
        const nextScore = score + 1;

        setScore(nextScore);
        setFlippedCardId(card.id);
        setIsShuffling(true);

        setTimeout(() => {
            setActiveCards((previousCards) => shuffleCards(previousCards));
            setFlippedCardId(null);
            setIsShuffling(false);

            if (nextScore === DIFFICULTY_COUNTS[selectedDifficulty]) {
                setHighScore((previousHighScore) => Math.max(previousHighScore, nextScore));
                setIsWon(true);
                setIsGameOver(true);
            }
        }, 500);
    };

    const handleStartGame = (difficulty) => {
        setActiveCards(getRandomCards(cards, DIFFICULTY_COUNTS[difficulty]));
        setSelectedDifficulty(difficulty);
        setScore(0);
        setIsGameOver(false);
        setIsWon(false);
        setClickedCards(new Set());
        setFlippedCardId(null);
        setIsShuffling(false);
    };

    const handleTryAgain = () => {
        setActiveCards((previousCards) => shuffleCards(previousCards));
        setScore(0);
        setIsGameOver(false);
        setIsWon(false);
        setClickedCards(new Set());
        setFlippedCardId(null);
        setIsShuffling(false);
    };

    const handleGoToMenu = () => {
        setSelectedDifficulty(null);
        setActiveCards([]);
        setScore(0);
        setIsGameOver(false);
        setIsWon(false);
        setClickedCards(new Set());
        setFlippedCardId(null);
        setIsShuffling(false);
    };

    const cardSize = "h-28 w-20 sm:h-32 sm:w-24";

    if (isGameOver) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <section className="rounded-2xl border-4 border-black bg-slate-900/80 p-8 text-center text-white shadow-2xl">
                    <p className="mb-4 text-4xl font-bold">{isWon ? "You Win!" : "Game Over"}</p>
                    <p className="text-xl">Score: {score}</p>
                    <p className="mb-6 text-xl">High Score: {highScore}</p>
                    <div className="flex gap-4">
                        <Button onClick={handleTryAgain}>Try Again</Button>
                        <Button onClick={handleGoToMenu}>Main Menu</Button>
                    </div>
                </section>
            </main>
        );
    }

    if (!selectedDifficulty) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <section className="rounded-2xl border-4 border-black bg-slate-900/80 p-8 text-center shadow-2xl">
                    <h1 className="mb-8 text-4xl font-black uppercase tracking-wide text-white">Memory Card</h1>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button onClick={() => handleStartGame("easy")}>Easy</Button>
                        <Button onClick={() => handleStartGame("normal")}>Normal</Button>
                        <Button onClick={() => handleStartGame("hard")}>Hard</Button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 py-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between rounded-xl border-4 border-black bg-slate-900/80 px-4 py-3 text-white shadow-xl">
                    <p className="text-xl font-bold">Score: {score}</p>
                    <p className="text-xl font-bold">High Score: {highScore}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                    {activeCards.map((card) => {
                        const isFlipped = flippedCardId === card.id;

                        return (
                            <button
                                key={card.id}
                                type="button"
                                onClick={() => handleCardClick(card)}
                                className={`card-3d ${cardSize} cursor-pointer rounded-xl border-4 border-black p-0 shadow-lg transition duration-300 hover:scale-105`}
                            >
                                <div className={`card-inner ${isFlipped ? "is-flipped" : ""}`}>
                                    <div className="card-face card-front">
                                        <img src={card.image} alt={card.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="card-face card-back" aria-hidden="true">
                                        <span>?</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}