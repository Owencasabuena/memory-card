import { useEffect, useState } from "react";

export default function App() {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [clickedCards, setClickedCards] = useState(new Set());

    const handleCardClick = (card) => {
        if (clickedCards.has(card.id)) {
            setIsGameOver(true);
        } else {
            setClickedCards((previousCards) => 
                new Set(previousCards).add(card.id)
            );

            setScore((previousScore) => previousScore + 1);
        }
    }

    const handleTryAgain = () => {
        setScore(0);
        setIsGameOver(false);
        setClickedCards(new Set());
    }

    useEffect(() => {
        if (isGameOver && score > highScore) {
            setHighScore(score);
        }
    }, [isGameOver, score, highScore])

    return (

    )
}