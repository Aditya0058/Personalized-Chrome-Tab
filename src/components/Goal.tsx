import './Goal.css'
import React from 'react';
// import './TrackCard.css';

export interface Goal {
  /** URL for the goal thumbnail image */
  thumbnailUrl?: string;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Optional label for the percentage, e.g., "70%" */
  progressLabel?: string;
  /** Callback when the card is clicked */
  onClick?: () => void;
}

const TrackCard: React.FC<Goal> = ({
  thumbnailUrl,
  progress = 70,
  progressLabel = '70%',
  onClick,
}) => {
  // Ensure progress stays within 0-100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = 100 - clampedProgress;

  return (
    <div className="track-card" onClick={onClick} role="button" tabIndex={0}>
      {/* 1. Thumbnail Section */}
      <div className="track-card__thumbnail">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Goal thumbnail" />
        ) : (
          <div className="track-card__thumbnail-placeholder" />
        )}
      </div>

      {/* 2. Progress Path Section */}
      <div className="track-card__path-area">
        <svg
          className="track-card__path-svg"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          {/* Background Track Line */}
          <path
            d="M 10,50 C 40,20 60,20 80,50 S 120,80 140,50 S 180,20 190,50"
            className="track-card__path-track"
          />
          {/* Filled Progress Line */}
          <path
            d="M 10,50 C 40,20 60,20 80,50 S 120,80 140,50 S 180,20 190,50"
            className="track-card__path-fill"
            style={{
              strokeDasharray: '100',
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        {/* 3. Flag & Percentage Label */}
        <div className="track-card__flag-container">
          <span className="track-card__progress-label">{progressLabel}</span>
          <div className="track-card__flag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 22V4c0-1.1.9-2 2-2h14l-4 6 4 6H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;