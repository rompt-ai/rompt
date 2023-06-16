import { cn } from "@/lib/utils"

interface ScoreBarProps {
    score: number // 0-100
    getScoreClassName?: (score: number) => string
}

export function ScoreBar({ score, getScoreClassName }: ScoreBarProps) {
    const showPlaceholder = Number.isNaN(score)

    return (
        <div className='w-full rounded-full bg-secondary'>
            <div
                className={cn(
                    "rounded-full px-2 py-1 text-xs leading-none",
                    !showPlaceholder && getScoreClassName?.(score),
                    showPlaceholder ? "text-center" : "text-right"
                )}
                style={{
                    width: `${showPlaceholder ? 100 : score}%`,
                    minWidth: 30,
                }}
            >
                <span className={cn("text-xs font-medium leading-none", showPlaceholder ? "text-muted-foreground" : "text-foreground")}>
                    {showPlaceholder ? "Waiting for feedback" : `${score.toFixed(2).replace(/[.,]00$/, "")}%`}
                </span>
            </div>
        </div>
    )
}
