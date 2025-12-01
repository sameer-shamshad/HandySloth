import { useState } from 'react';
import type { Tool } from '../../types';

interface ToolCommunityRatingsProps {
  tool: Tool | undefined;
}

const ToolCommunityRatings = ({ tool }: ToolCommunityRatingsProps) => {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handlePost = () => {
    // Handle post logic here
    console.log('Posting rating:', selectedRating, feedback);
    setFeedback('');
  };

  const handleUpvote = () => {
    // Handle upvote logic here
    console.log('Upvoting tool');
  };

  return (
    <div className="flex flex-col gap-4 bg-transparent lg:bg-primary-bg px-3 lg:px-6 py-8 rounded-3xl">
      <h3 className="text-lg font-bold text-primary-color">Community Ratings</h3>

      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="currentColor"
          className="bi bi-star-fill text-secondary-color"
          viewBox="0 0 16 16"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
        <span className="text-4xl font-bold text-primary-color">0</span>
      </div>
      
      <p className="text-sm text-secondary-color">No ratings yet.</p>

      <div className="w-full flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="w-full sm:max-w-sm flex items-center justify-between gap-3 border-b py-3">
            <div className="flex items-center gap-1">
              {[...Array(stars)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-star-fill text-primary-color"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
              ))}
            </div>
            
            <span className="text-xs text-secondary-color w-8 text-right">0</span>
          </div>
        ))}
      </div>

      {/* Rating Input Section */}
      <h3 className="text-lg font-bold text-primary-color mt-3">How would you rate this tool?</h3>
      
      <p className="text-sm text-secondary-color">
        Help other people by letting them know if this AI was useful.
      </p>

      <label className="text-sm font-medium text-primary-color">Your rating</label>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className="focus:outline-none bg-transparent!"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className={`bi bi-star-fill text-primary-color dark:text-secondary-color'
              }`}
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          </button>
        ))}
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder={`Let people know what you think about ${tool?.name || 'this tool'}. It helps to provide much detail as possible about your experience.`}
        className="w-full min-h-[120px] rounded-md border border-border-color bg-secondary-bg/40 px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color resize-none"
      />

      <button
        type="button"
        onClick={handlePost}
        className="w-min rounded-md bg-[#3E3E3E]! dark:bg-[#404758]! px-8! py-3! text-sm font-medium text-white!"
      >
        Post
      </button>

      {/* Upvote Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-primary-color">Upvote this Tool</h3>
        
        <button
          type="button"
          onClick={handleUpvote}
          className="max-w-xs flex items-center justify-center gap-2 rounded-xl bg-[#A9ECAD]! px-6 py-2! text-base font-semibold text-black-color!"
        >
          <span className="material-symbols-outlined text-sm! p-1! px-2! border rounded-full">arrow_upward</span>
          <span>Upvote</span>
        </button>
      </div>
    </div>
  );
};

export default ToolCommunityRatings;

